from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Extremadura sin prisas"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite:///./extremadura_sin_prisas.db"
    secret_key: str = Field(default="change-me-in-production-with-32-bytes", min_length=32)
    access_token_expire_minutes: int = 60
    refresh_token_expire_minutes: int = 60 * 24 * 7
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    frontend_url: str = "http://localhost:5173"
    common_passport_qr_url: str = "http://localhost:5173/activar"
    stripe_secret_key: str = ""
    stripe_public_key: str = ""
    stripe_webhook_secret: str = ""
    redsys_merchant_code: str = ""
    redsys_terminal: str = ""
    redsys_secret_key: str = ""
    redsys_env: str = "sandbox"
    redsys_currency: str = "978"
    redsys_transaction_type: str = "0"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
