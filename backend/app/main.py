from fastapi import FastAPI
from app.core.database import SessionLocal, Base, engine
from app.services.user_seed import seed_admin
from app.services.db_migration import migrate_claims_table
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, claims, validate, rules, metrics, admin

app = FastAPI(title="Humaein Mini RCM API", version="0.1.0")

@app.on_event("startup")
def startup():
    # Ensure tables exist (lightweight for SQLite/dev; for Postgres use migrations)
    Base.metadata.create_all(bind=engine)
    # Run database migrations for existing tables
    migrate_claims_table()
    db = SessionLocal()
    try:
        seed_admin(db)
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(claims.router, prefix="/api/v1")
app.include_router(validate.router, prefix="/api/v1")
app.include_router(rules.router, prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/healthz")
def healthz():
    return {"ok": True}
