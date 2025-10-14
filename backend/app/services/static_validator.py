from datetime import date
from typing import Tuple
from app.services.id_utils import validate_ids
from app.config.tenant_config import get_validation_thresholds

def validate_static(row: dict, tenant_id: str = "default") -> Tuple[list[dict], list[dict]]:
    errors, warnings = [], []
    
    # Get tenant-specific configuration
    thresholds = get_validation_thresholds(tenant_id)
    required_approval_codes = set(thresholds.get("required_approval_service_codes", ["SRV2001", "SRV3002"]))
    max_amount_without_approval = thresholds.get("max_paid_amount_without_approval", 1000.0)
    
    errors.extend(validate_ids(row))
    
    # Service code approval validation
    code = (row.get("service_code") or "").strip().upper()
    if code in required_approval_codes and not (row.get("approval_number") and str(row["approval_number"]).strip()):
        errors.append({"rule":"TECH-APPROVAL-001","field":"approval_number","msg":f"Approval required for {code}"})
    
    # High-value claims approval validation
    paid_amount = row.get("paid_amount_aed", 0) or 0
    if paid_amount > max_amount_without_approval:
        if not (row.get("approval_number") and str(row["approval_number"]).strip()):
            errors.append({"rule":"TECH-APPROVAL-002","field":"approval_number","msg":f"High-value claim (>{max_amount_without_approval} AED) requires approval"})
    
    # Service date validation
    sd: date | None = row.get("service_date")
    if not sd:
        errors.append({"rule":"TECH-DATE-001","field":"service_date","msg":"Missing service_date"})
    
    # Encounter type validation
    enc = (row.get("encounter_type") or "").strip().upper()
    if enc not in {"INPATIENT","OUTPATIENT","EMERGENCY"}:
        warnings.append({"rule":"TECH-ENC-001","field":"encounter_type","msg":"Unexpected encounter_type"})
    
    # Diagnosis validation
    diag = (row.get("diagnosis_codes") or "").strip()
    if not diag:
        errors.append({"rule":"MED-DIAG-001","field":"diagnosis_codes","msg":"Missing diagnosis codes"})
    
    return errors, warnings
