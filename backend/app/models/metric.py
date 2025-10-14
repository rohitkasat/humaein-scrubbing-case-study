from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Metric(Base):
    __tablename__ = "metrics"
    id = Column(Integer, primary_key=True)
    key = Column(String, index=True)
    value = Column(Float)
