from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Order, OrderItem, Passport, Payment
from app.repositories import order_repository
from app.schemas.orders import CheckoutSessionRequest, OrderCreateRequest
from app.services.audit import record_audit
from app.services.utils import generate_activation_code, generate_serial


def create_order(db: Session, payload: OrderCreateRequest, buyer_user_id: int | None) -> Order:
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order needs at least one item")

    items: list[OrderItem] = []
    total_cents = 0
    for requested_item in payload.items:
        passport_type = order_repository.get_passport_type(db, requested_item.passport_type_id)
        if passport_type is None or not passport_type.is_active:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Passport type {requested_item.passport_type_id} not found")
        if requested_item.quantity < 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be at least 1")
        item_total = passport_type.price_cents * requested_item.quantity
        total_cents += item_total
        items.append(
            OrderItem(
                route_id=passport_type.route_id,
                passport_type_id=passport_type.id,
                quantity=requested_item.quantity,
                unit_price_cents=passport_type.price_cents,
                total_cents=item_total,
            )
        )

    order = Order(
        buyer_user_id=buyer_user_id,
        buyer_email=payload.buyer_email,
        buyer_name=payload.buyer_name,
        buyer_phone=payload.buyer_phone,
        status="pending",
        total_cents=total_cents,
        items=items,
    )
    db.add(order)
    db.flush()
    record_audit(db, "order.created", "order", str(order.id), actor_user_id=buyer_user_id, metadata={"total_cents": total_cents})
    db.commit()
    db.refresh(order)
    return order


def create_checkout_session(db: Session, payload: CheckoutSessionRequest) -> Payment:
    order = order_repository.get_order(db, payload.order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.status not in {"pending", "failed"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order is not payable")
    payment = Payment(
        order_id=order.id,
        provider="mock",
        method=payload.method,
        amount_cents=order.total_cents,
        currency=order.currency,
        status="pending",
        provider_payment_id=f"mock_{order.id}_{payload.method}",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def confirm_mock_payment(db: Session, payment_id: int, outcome: str) -> tuple[Payment, Order, list[Passport]]:
    payment = order_repository.get_payment(db, payment_id)
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")

    order = payment.order
    created_passports: list[Passport] = []

    if outcome == "success":
        payment.status = "paid"
        payment.raw_response_json = '{"provider":"mock","outcome":"success"}'
        order.status = "paid"
        if not order.passports:
            for item in order.items:
                for _ in range(item.quantity):
                    created_passports.append(
                        Passport(
                            route_id=item.route_id,
                            passport_type_id=item.passport_type_id,
                            order_id=order.id,
                            serial_number=generate_serial("ESP"),
                            activation_code=generate_activation_code(),
                            operational_status="inactive",
                            stamp_status="unstamped",
                        )
                    )
            db.add_all(created_passports)
        record_audit(db, "payment.paid", "payment", str(payment.id), metadata={"order_id": order.id})
    elif outcome == "failed":
        payment.status = "failed"
        payment.raw_response_json = '{"provider":"mock","outcome":"failed"}'
        order.status = "failed"
    elif outcome == "cancelled":
        payment.status = "cancelled"
        payment.raw_response_json = '{"provider":"mock","outcome":"cancelled"}'
        order.status = "cancelled"
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported outcome")

    db.commit()
    db.refresh(payment)
    db.refresh(order)
    if not created_passports:
        created_passports = list(order.passports)
    return payment, order, created_passports

