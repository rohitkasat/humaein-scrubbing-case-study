from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.claim import Claim

router = APIRouter(prefix="/metrics", tags=["metrics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("")
def basic_metrics(db: Session = Depends(get_db)):
    total = db.query(Claim).count()
    with_errors = db.query(Claim).filter(Claim.status == "not_validated").count()
    error_rate = (with_errors / total) * 100 if total else 0.0
    categories = {}
    for c in db.query(Claim).all():
        et = c.error_type or "none"
        categories.setdefault(et, {"count":0, "paid_sum":0.0})
        categories[et]["count"] += 1
        categories[et]["paid_sum"] += c.paid_amount_aed or 0.0
    waterfall = [
        {"category": k, "count": v["count"], "paid_amount_aed": round(v["paid_sum"],2)}
        for k,v in categories.items()
    ]
    return {"metrics":[{"key":"claims_total","value":total},{"key":"error_rate_pct","value":round(error_rate,2)}], "waterfall": waterfall}
