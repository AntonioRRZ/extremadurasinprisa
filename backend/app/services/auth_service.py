from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import User
from app.repositories import passport_repository, user_repository
from app.schemas.auth import ActivationRegisterRequest, LoginRequest, RegisterRequest, TokenResponse
from app.schemas.common import UserSummary
from app.security.passwords import hash_password, verify_password
from app.security.tokens import create_access_token, create_refresh_token, decode_token
from app.services.audit import record_audit


def register_user(db: Session, payload: RegisterRequest) -> TokenResponse:
    del db, payload
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Public registration is disabled. Use the activation code from your physical passport.",
    )


def register_user_with_activation(db: Session, payload: ActivationRegisterRequest) -> TokenResponse:
    if user_repository.get_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    activation_code = payload.activation_code.strip().upper()
    passport = passport_repository.get_by_activation_code(db, activation_code)
    if passport is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activation code not found")
    if passport.activated_by_user_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Passport already activated")
    if passport.operational_status == "cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passport is cancelled")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        role="user",
        is_active=True,
    )
    db.add(user)
    db.flush()

    passport.activated_by_user_id = user.id
    passport.owner_display_name = payload.owner_display_name or payload.full_name
    passport.start_date = payload.start_date or passport.start_date
    passport.operational_status = "active"
    passport.activated_at = datetime.now(UTC).replace(tzinfo=None)

    record_audit(
        db,
        "user.registered_via_activation",
        "user",
        str(user.id),
        actor_user_id=user.id,
        metadata={"passport_id": passport.id, "activation_code": activation_code},
    )
    record_audit(db, "passport.activated", "passport", str(passport.id), actor_user_id=user.id)
    db.commit()
    db.refresh(user)
    return build_token_response(user)


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = user_repository.get_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
    return build_token_response(user)


def refresh_access_token(db: Session, refresh_token: str) -> TokenResponse:
    try:
        payload = decode_token(refresh_token, "refresh")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    user = user_repository.get_by_id(db, int(payload["sub"]))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not available")
    return build_token_response(user)


def build_token_response(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        user=UserSummary.model_validate(user),
    )
