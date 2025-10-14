from pydantic import BaseModel
from datetime import date

class ClaimIn(BaseModel):
    encounter_type: str
    service_date: date
    national_id: str
    member_id: str
    facility_id: str
    unique_id: str
    diagnosis_codes: str
    approval_number: str | None = None
    service_code: str
    paid_amount_aed: float

class ValidateRequest(BaseModel):
    claim_ids: list[int]
