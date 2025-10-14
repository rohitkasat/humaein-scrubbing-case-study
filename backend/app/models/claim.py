from sqlalchemy import Column, Integer, String, Date, Float, JSON, DateTime
from datetime import datetime
from app.core.database import Base

class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True)
    encounter_type = Column(String, index=True)
    service_date = Column(Date, index=True)
    national_id = Column(String, index=True)
    member_id = Column(String, index=True)
    facility_id = Column(String, index=True)
    unique_id = Column(String, unique=True, index=True)
    diagnosis_codes = Column(String)
    approval_number = Column(String, nullable=True)
    service_code = Column(String, index=True)
    paid_amount_aed = Column(Float)
    stage = Column(String, default="raw")
    errors = Column(JSON, default=[])
    warnings = Column(JSON, default=[])
    llm_explain = Column(String, nullable=True)
    status = Column(String, default="pending")  # validated / not_validated
    error_type = Column(String, nullable=True)   # none / medical / technical / both
    error_explanation = Column(String, nullable=True)
    recommended_action = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
