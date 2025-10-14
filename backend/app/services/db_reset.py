from sqlalchemy import text
from app.core.database import engine
from app.models.claim import Claim
from app.core.database import SessionLocal

def reset_database():
    """Reset the database to fresh state - delete all claims data"""
    try:
        db = SessionLocal()
        try:
            # Delete all claims
            deleted_count = db.query(Claim).count()
            db.query(Claim).delete()
            db.commit()
            print(f"✅ Database reset: {deleted_count} claims removed")
            return {"status": "success", "deleted_claims": deleted_count}
        finally:
            db.close()
    except Exception as e:
        print(f"❌ Database reset failed: {e}")
        return {"status": "error", "message": str(e)}