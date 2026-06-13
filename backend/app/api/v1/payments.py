from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.orders import CheckoutSessionRequest, CheckoutSessionResponse, MockConfirmRequest, MockConfirmResponse
from app.services import order_service
from app.services.serializers import serialize_order, serialize_passport_summary, serialize_payment

router = APIRouter(prefix="/payments")


@router.post("/checkout-session", response_model=CheckoutSessionResponse)
def checkout_session(payload: CheckoutSessionRequest, db: Session = Depends(get_db)):
    payment = order_service.create_checkout_session(db, payload)
    return CheckoutSessionResponse(payment=serialize_payment(payment), mock_checkout_token=f"mock-session-{payment.id}")


@router.post("/mock/confirm", response_model=MockConfirmResponse)
def confirm_mock_payment(payload: MockConfirmRequest, db: Session = Depends(get_db)):
    payment, order, passports = order_service.confirm_mock_payment(db, payload.payment_id, payload.outcome)
    return MockConfirmResponse(
        payment=serialize_payment(payment),
        order=serialize_order(order),
        passports=[serialize_passport_summary(db, passport) for passport in passports],
    )

