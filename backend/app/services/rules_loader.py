from app.utils.pdf_parser import extract_rules_from_pdf

def load_rules_from_files() -> list[dict]:
    import os
    base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    tech_path = os.path.join(base_path, "Humaein_Technical_Rules.pdf")
    med_path = os.path.join(base_path, "Humaein_Medical_Rules.pdf")
    tech = extract_rules_from_pdf(tech_path) if os.path.exists(tech_path) else ""
    med = extract_rules_from_pdf(med_path) if os.path.exists(med_path) else ""
    rules = []
    if "approval" in tech.lower():
        rules.append({
            "code": "TECH-APPROVAL-001",
            "name": "Approval required",
            "category": "technical",
            "params": {"service_codes": ["SRV2001", "SRV3002"]},
            "description": "Approval number must be present for certain service codes."
        })
    rules.append({
        "code": "TECH-ID-001",
        "name": "National ID format",
        "category": "technical",
        "params": {},
        "description": "National ID must match the required format."
    })
    rules.append({
        "code": "TECH-ID-002",
        "name": "Member ID format",
        "category": "technical",
        "params": {},
        "description": "Member ID must match the required format."
    })
    rules.append({
        "code": "TECH-ID-003",
        "name": "Facility ID format",
        "category": "technical",
        "params": {},
        "description": "Facility ID must match the required format."
    })
    rules.append({
        "code": "TECH-ID-004",
        "name": "Unique ID format",
        "category": "technical",
        "params": {},
        "description": "Unique ID must match the required format."
    })
    rules.append({
        "code": "MED-DIAG-001",
        "name": "Diagnosis present",
        "category": "medical",
        "params": {},
        "description": "Diagnosis code must be present for all claims."
    })
    return rules
