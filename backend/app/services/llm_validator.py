from typing import Optional
from app.core.config import settings

async def llm_explain(row: dict, errors: list[dict]) -> Optional[str]:
    if not errors:
        return None
    provider = settings.LLM_PROVIDER.lower()
    if provider == "openai" and settings.OPENAI_API_KEY:
        return "Validation failed on key fields. Please review ID formats, add approval number for SRV codes, and provide diagnosis codes."
    if provider == "anthropic" and settings.ANTHROPIC_API_KEY:
        return "Some fields are invalid or missing. Ensure approval for required services and valid identifiers."
    return None
