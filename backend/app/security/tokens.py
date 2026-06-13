from datetime import UTC, datetime, timedelta

import jwt

from app.core.config import settings


def _encode_token(subject: str, token_type: str, expires_minutes: int) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def create_access_token(subject: str) -> str:
    return _encode_token(subject, "access", settings.access_token_expire_minutes)


def create_refresh_token(subject: str) -> str:
    return _encode_token(subject, "refresh", settings.refresh_token_expire_minutes)


def decode_token(token: str, expected_type: str) -> dict:
    payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    if payload.get("type") != expected_type:
        raise jwt.InvalidTokenError("Unexpected token type")
    return payload

