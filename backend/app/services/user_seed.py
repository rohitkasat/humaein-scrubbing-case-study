from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password
from app.core.config import settings

def seed_admin(db: Session):
    existing = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if existing:
        return existing
    admin = User(email=settings.ADMIN_EMAIL,
                 password_hash=hash_password(settings.ADMIN_PASSWORD),
                 is_admin=True)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin