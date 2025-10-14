from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.claim import Claim
from app.services.static_validator import validate_static
from app.services.llm_validator import llm_explain

router = APIRouter(prefix="/validate", tags=["validate"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/run")
async def run_validate(claim_ids: list[int] = Body(...), db: Session = Depends(get_db)):
    try:
        results = []
        claims = db.query(Claim).filter(Claim.id.in_(claim_ids)).all()
        if not claims:
            return {"results": [], "message": f"No claims found with IDs: {claim_ids}"}
        for claim in claims:
            row = {
                "encounter_type": claim.encounter_type,
                "service_date": claim.service_date,
                "national_id": claim.national_id,
                "member_id": claim.member_id,
                "facility_id": claim.facility_id,
                "unique_id": claim.unique_id,
                "diagnosis_codes": claim.diagnosis_codes,
                "approval_number": claim.approval_number,
                "service_code": claim.service_code,
                "paid_amount_aed": claim.paid_amount_aed,
            }
            errs, warns = validate_static(row)
            explain = await llm_explain(row, errs)
            claim.errors = errs
            claim.warnings = warns
            claim.llm_explain = explain
            claim.status = "validated" if not errs else "not_validated"
            tech_err = any(e["rule"].startswith("TECH-") for e in errs)
            med_err = any(e["rule"].startswith("MED-") for e in errs)
            if not errs:
                claim.error_type = "none"
            elif tech_err and med_err:
                claim.error_type = "both"
            elif tech_err:
                claim.error_type = "technical"
            else:
                claim.error_type = "medical"
            # Generate detailed error explanations with bullet points
            if errs:
                explanations = []
                actions = []
                for e in errs:
                    rule_code = e['rule']
                    explanations.append(f"• [{rule_code}] {e['msg']}")
                    
                    # Add detailed explanation based on rule type
                    if rule_code == "TECH-ID-004":
                        explanations.append(f"  - Unique ID '{claim.unique_id}' does not follow the required XXXX-XXXX-XXXX format")
                        explanations.append(f"  - Technical rules require unique identifiers to be 4-4-4 alphanumeric pattern")
                        actions.append("Reformat unique_id to follow XXXX-XXXX-XXXX pattern using uppercase letters and numbers")
                    
                    elif rule_code == "TECH-APPROVAL-001":
                        explanations.append(f"  - Service code '{claim.service_code}' requires prior approval per technical guidelines")
                        explanations.append(f"  - Approval number is missing or invalid for high-cost procedures")
                        actions.append("Obtain prior approval for this service code and update approval_number field")
                    
                    elif rule_code.startswith("TECH-ID-"):
                        field_name = e.get('field', 'identifier')
                        explanations.append(f"  - {field_name} format validation failed per technical specifications")
                        actions.append(f"Verify and correct {field_name} format according to system standards")
                    
                    elif rule_code == "MED-DIAG-001":
                        explanations.append(f"  - Medical rules require valid diagnosis codes for all claims")
                        explanations.append(f"  - Missing diagnosis prevents medical necessity validation")
                        actions.append("Add appropriate ICD-10 diagnosis codes that justify the provided service")
                
                claim.error_explanation = "\n".join(explanations)
                claim.recommended_action = "; ".join(actions) if actions else "Review and correct identified issues"
            else:
                claim.error_explanation = None
                claim.recommended_action = None
            results.append({"id": claim.id, "unique_id": claim.unique_id, "errors": errs, "warnings": warns, "status": claim.status, "error_type": claim.error_type, "explain": explain})
        db.commit()
        return {"results": results}
    except Exception as e:
        return {"error": str(e), "message": "Validation failed"}
