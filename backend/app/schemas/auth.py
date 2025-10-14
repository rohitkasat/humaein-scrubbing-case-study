from pydantic import BaseModel, constr

# Using a relaxed pattern to allow internal testing domains like humaein.local
class LoginRequest(BaseModel):
    email: constr(strip_whitespace=True, min_length=3)
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
