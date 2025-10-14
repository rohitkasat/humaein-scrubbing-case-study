from pydantic import BaseModel

class MetricOut(BaseModel):
    key: str
    value: float
