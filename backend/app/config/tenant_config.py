# Multi-tenant configuration settings
# This allows switching rule sets without code changes

DEFAULT_TENANT = "default"

TENANT_CONFIGS = {
    "default": {
        "technical_rules_file": "resource/Humaein_Technical_Rules.pdf",
        "medical_rules_file": "resource/Humaein_Medical_Rules.pdf",
        "validation_thresholds": {
            "max_paid_amount_without_approval": 1000.0,
            "required_approval_service_codes": ["SRV2001", "SRV3002"]
        }
    },
    "tenant_a": {
        "technical_rules_file": "config/tenant_a_technical_rules.pdf", 
        "medical_rules_file": "config/tenant_a_medical_rules.pdf",
        "validation_thresholds": {
            "max_paid_amount_without_approval": 500.0,
            "required_approval_service_codes": ["SRV2001", "SRV3002", "SRV4001"]
        }
    },
    "tenant_b": {
        "technical_rules_file": "config/tenant_b_technical_rules.pdf",
        "medical_rules_file": "config/tenant_b_medical_rules.pdf", 
        "validation_thresholds": {
            "max_paid_amount_without_approval": 2000.0,
            "required_approval_service_codes": ["SRV2001"]
        }
    }
}

def get_tenant_config(tenant_id: str = DEFAULT_TENANT):
    """Get configuration for a specific tenant"""
    return TENANT_CONFIGS.get(tenant_id, TENANT_CONFIGS[DEFAULT_TENANT])

def get_validation_thresholds(tenant_id: str = DEFAULT_TENANT):
    """Get validation thresholds for a tenant"""
    config = get_tenant_config(tenant_id)
    return config.get("validation_thresholds", {})