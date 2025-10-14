from fastapi import APIRouter, HTTPException, Depends
from app.core.security import create_token
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.config import settings
from jose import jwt, JWTError
from app.core.config import settings as cfg
from app.services.db_reset import reset_database

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    if payload.email == settings.ADMIN_EMAIL and payload.password == settings.ADMIN_PASSWORD:
        # Reset database on every login for fresh demo sessions
        reset_result = reset_database()
        print(f"🔄 Auto-reset on login: {reset_result}")
        
        return TokenResponse(access_token=create_token(payload.email))
    # Uniform error surface (avoid 500)
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/me")
def me(authorization: str | None = None):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    if authorization.lower().startswith("bearer "):
        token = authorization.split(" ",1)[1]
    else:
        token = authorization
    try:
        payload = jwt.get_unverified_claims(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"email": payload.get("sub"), "admin": payload.get("sub") == cfg.ADMIN_EMAIL}
