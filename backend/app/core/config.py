from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DATABASE_PATH = (PROJECT_ROOT / "extremadura_sin_prisas.db").as_posix()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(PROJECT_ROOT / ".env"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Extremadura sin prisas"
    api_prefix: str = "/api/v1"
    database_url: str = f"sqlite:///{DEFAULT_DATABASE_PATH}"
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

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_sqlite_database_url(cls, value: str) -> str:
        prefix = "sqlite:///"
        if isinstance(value, str) and value.startswith(prefix):
            sqlite_path = value[len(prefix):]
            if sqlite_path.startswith("./"):
                return f"{prefix}{(PROJECT_ROOT / sqlite_path[2:]).as_posix()}"
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
