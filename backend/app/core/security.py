from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from app.core.config import settings

ALGO = "HS256"

def hash_password(p: str) -> str:
    # Truncate password to 72 bytes to avoid bcrypt limitation
    password_bytes = p.encode('utf-8')[:72]
    # Generate salt and hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(p: str, hp: str) -> bool:
    # Truncate password to 72 bytes to match hashing behavior
    password_bytes = p.encode('utf-8')[:72]
    hashed_bytes = hp.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_token(sub: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MIN)
    to_encode = {"sub": sub, "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGO)
