
from typing import Optional
from app.core.config import settings
import httpx

async def llm_explain(row: dict, errors: list[dict]) -> Optional[str]:
    if not errors:
        return None
    provider = settings.LLM_PROVIDER.lower()
    if provider == "openai" and settings.OPENAI_API_KEY:
        prompt = (
            "You are a medical claims validation assistant. "
            "Given the following claim data and validation errors, explain in plain English what is wrong and what the user should do to fix it. "
            f"\nClaim: {row}\nErrors: {errors}\nExplanation:"
        )
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful medical claims validation assistant."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 128,
            "temperature": 0.2
        }
        print("[LLM] Calling OpenAI API for claim explanation...")
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data
            )
            print(f"[LLM] OpenAI API response status: {resp.status_code}")
            if resp.status_code == 200:
                result = resp.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                return f"[LLM error: {resp.status_code}] {resp.text}"
    if provider == "anthropic" and settings.ANTHROPIC_API_KEY:
        return "Some fields are invalid or missing. Ensure approval for required services and valid identifiers."
    return None
