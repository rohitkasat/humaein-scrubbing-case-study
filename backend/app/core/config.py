from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@db:5432/rcm"
    JWT_SECRET: str = "change_me"
    JWT_EXPIRE_MIN: int = 120
    LLM_PROVIDER: str = "openai"
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    STATIC_RULES_SOURCE: str = "files"
    ADMIN_EMAIL: str = "admin@humaein.local"
    ADMIN_PASSWORD: str = "Admin@123"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
