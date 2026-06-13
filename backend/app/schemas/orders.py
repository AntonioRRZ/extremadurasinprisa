from pydantic import BaseModel, EmailStr

from app.schemas.common import OrderSummary, PassportSummary, PaymentSummary


class OrderCreateItem(BaseModel):
    passport_type_id: int
    quantity: int


class OrderCreateRequest(BaseModel):
    buyer_email: EmailStr
    buyer_name: str
    buyer_phone: str | None = None
    items: list[OrderCreateItem]


class OrderCreateResponse(BaseModel):
    order: OrderSummary


class CheckoutSessionRequest(BaseModel):
    order_id: int
    method: str


class CheckoutSessionResponse(BaseModel):
    payment: PaymentSummary
    mock_checkout_token: str


class MockConfirmRequest(BaseModel):
    payment_id: int
    outcome: str


class MockConfirmResponse(BaseModel):
    payment: PaymentSummary
    order: OrderSummary
    passports: list[PassportSummary]

