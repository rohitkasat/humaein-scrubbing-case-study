from fastapi import APIRouter
from app.config.tenant_config import TENANT_CONFIGS, get_tenant_config
from app.services.db_reset import reset_database

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/tenants")
def list_tenants():
    """List all available tenant configurations"""
    return {
        "tenants": [
            {
                "id": tenant_id,
                "config": config
            }
            for tenant_id, config in TENANT_CONFIGS.items()
        ]
    }

@router.get("/tenant/{tenant_id}")
def get_tenant_info(tenant_id: str):
    """Get configuration for a specific tenant"""
    config = get_tenant_config(tenant_id)
    return {
        "tenant_id": tenant_id,
        "config": config
    }

@router.post("/reset-database")
def reset_db():
    """Reset database to fresh state - removes all claims data"""
    return reset_database()

@router.get("/health")
def health():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "Humaein Mini RCM",
        "version": "1.0.0"
    }
