from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Order, PassportType, Payment


def get_order(db: Session, order_id: int) -> Order | None:
    return db.get(Order, order_id)


def list_orders_for_user(db: Session, user_id: int) -> list[Order]:
    return list(db.scalars(select(Order).where(Order.buyer_user_id == user_id).order_by(Order.created_at.desc())))


def list_orders(db: Session) -> list[Order]:
    return list(db.scalars(select(Order).order_by(Order.created_at.desc())))


def get_passport_type(db: Session, passport_type_id: int) -> PassportType | None:
    return db.get(PassportType, passport_type_id)


def get_payment(db: Session, payment_id: int) -> Payment | None:
    return db.get(Payment, payment_id)

