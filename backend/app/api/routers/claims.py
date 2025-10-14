from fastapi import APIRouter, UploadFile, File, Depends
import tempfile, os
from app.services.ingest_excel import read_claims_excel
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.claim import Claim

router = APIRouter(prefix="/claims", tags=["claims"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    try:
        rows = read_claims_excel(tmp_path)
        created = []
        updated = []
        
        for r in rows:
            # Handle NaN values properly for string fields
            approval_number = r.get("approval_number")
            if approval_number is not None and str(approval_number).lower() == 'nan':
                approval_number = None
            
            unique_id = r.get("unique_id")
            
            # Check if this unique_id already exists
            existing_claim = db.query(Claim).filter(Claim.unique_id == unique_id).first()
            if existing_claim:
                # Update existing claim with new data
                existing_claim.encounter_type = r.get("encounter_type")
                existing_claim.service_date = r.get("service_date")
                existing_claim.national_id = r.get("national_id")
                existing_claim.member_id = r.get("member_id")
                existing_claim.facility_id = r.get("facility_id")
                existing_claim.diagnosis_codes = r.get("diagnosis_codes")
                existing_claim.approval_number = approval_number
                existing_claim.service_code = r.get("service_code")
                existing_claim.paid_amount_aed = r.get("paid_amount_aed", 0.0)
                # Reset validation status since data changed
                existing_claim.status = "pending"
                existing_claim.errors = []
                existing_claim.warnings = []
                existing_claim.llm_explain = None
                existing_claim.error_type = None
                existing_claim.error_explanation = None
                existing_claim.recommended_action = None
                updated.append(existing_claim)
            else:
                # Create new claim
                claim = Claim(
                    encounter_type=r.get("encounter_type"),
                    service_date=r.get("service_date"),
                    national_id=r.get("national_id"),
                    member_id=r.get("member_id"),
                    facility_id=r.get("facility_id"),
                    unique_id=unique_id,
                    diagnosis_codes=r.get("diagnosis_codes"),
                    approval_number=approval_number,
                    service_code=r.get("service_code"),
                    paid_amount_aed=r.get("paid_amount_aed", 0.0),
                )
                db.add(claim)
                created.append(claim)
        
        db.commit()
        
        # Include both created and updated claims in preview
        all_processed = created + updated
        preview = [{"id": c.id, "unique_id": c.unique_id} for c in all_processed[:5]]
        
        return {
            "count": len(rows), 
            "created": len(created),
            "updated": len(updated),
            "preview": preview,
            "message": f"Processed {len(rows)} rows: {len(created)} created, {len(updated)} updated"
        }
    except Exception as e:
        db.rollback()
        raise Exception(f"Upload failed: {str(e)}")
    finally:
        os.unlink(tmp_path)

@router.get("/")
async def list_claims(db: Session = Depends(get_db)):
    claims = db.query(Claim).all()
    return {"claims": [{"id": c.id, "unique_id": c.unique_id, "status": c.status} for c in claims]}
