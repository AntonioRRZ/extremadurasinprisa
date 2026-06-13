from datetime import date

from pydantic import BaseModel, EmailStr

from app.schemas.common import UserSummary


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None


class ActivationRegisterRequest(BaseModel):
    activation_code: str
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    owner_display_name: str | None = None
    start_date: date | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserSummary
