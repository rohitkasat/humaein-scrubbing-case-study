from sqlalchemy import Column, Integer, String, Boolean, JSON
from app.core.database import Base

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String)
    active = Column(Boolean, default=True)
    params = Column(JSON, default={})
    category = Column(String)
