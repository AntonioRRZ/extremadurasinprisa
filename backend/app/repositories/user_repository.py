from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Order, OrderItem, Passport, Route, Stamp, User


def get_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def list_users(db: Session) -> list[User]:
    return list(db.scalars(select(User).order_by(User.created_at.desc())))


def list_admin_users(db: Session) -> list[User]:
    query = (
        select(User)
        .options(
            selectinload(User.activated_passports).selectinload(Passport.route),
            selectinload(User.activated_passports).selectinload(Passport.stamps).selectinload(Stamp.stamp_point),
        )
        .order_by(User.created_at.desc())
    )
    return list(db.scalars(query))


def get_admin_user_detail(db: Session, user_id: int) -> User | None:
    query = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.orders).selectinload(Order.items).selectinload(OrderItem.route),
            selectinload(User.orders).selectinload(Order.items).selectinload(OrderItem.passport_type),
            selectinload(User.activated_passports).selectinload(Passport.route).selectinload(Route.stamp_points),
            selectinload(User.activated_passports).selectinload(Passport.passport_type),
            selectinload(User.activated_passports).selectinload(Passport.stamps).selectinload(Stamp.stamp_point),
        )
    )
    return db.scalar(query)
