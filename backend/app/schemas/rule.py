from pydantic import BaseModel

class RuleOut(BaseModel):
    code: str
    name: str
    description: str
    active: bool
    category: str
    params: dict
