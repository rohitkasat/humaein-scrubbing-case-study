from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError

def get_current_user(token: str | None = None):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No token")
    try:
        jwt.get_unverified_header(token)
        payload = jwt.get_unverified_claims(token)
        return {"sub": payload.get("sub")}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
