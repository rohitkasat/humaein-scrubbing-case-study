from app.services.static_validator import validate_static

def test_validation_success():
    row = {
        "encounter_type": "OUTPATIENT",
        "service_date": "2024-01-01",
        "national_id": "123456789012345",
        "member_id": "MEM123456",
        "facility_id": "FAC001",
        "unique_id": "UNQ001",
        "diagnosis_codes": "A01.1",
        "service_code": "CONS001",
        "paid_amount_aed": 100.0
    }
    errors, warnings = validate_static(row)
    assert len(errors) == 0

def test_validation_missing_diagnosis():
    row = {
        "encounter_type": "OUTPATIENT",
        "service_date": "2024-01-01",
        "national_id": "123456789012345",
        "member_id": "MEM123456", 
        "facility_id": "FAC001",
        "unique_id": "UNQ001",
        "diagnosis_codes": "",
        "service_code": "CONS001",
        "paid_amount_aed": 100.0
    }
    errors, warnings = validate_static(row)
    assert len(errors) == 1
    assert errors[0]["rule"] == "MED-DIAG-001"

def test_validation_approval_required():
    row = {
        "encounter_type": "OUTPATIENT",
        "service_date": "2024-01-01", 
        "national_id": "123456789012345",
        "member_id": "MEM123456",
        "facility_id": "FAC001",
        "unique_id": "UNQ001",
        "diagnosis_codes": "A01.1",
        "service_code": "SRV2001",  # Requires approval
        "approval_number": "",
        "paid_amount_aed": 100.0
    }
    errors, warnings = validate_static(row)
    assert len(errors) == 1
    assert errors[0]["rule"] == "TECH-APPROVAL-001"