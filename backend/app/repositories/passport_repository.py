from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Passport, Stamp, StampPoint


def get_by_activation_code(db: Session, activation_code: str) -> Passport | None:
    return db.scalar(select(Passport).where(Passport.activation_code == activation_code))


def list_user_passports(db: Session, user_id: int) -> list[Passport]:
    return list(db.scalars(select(Passport).where(Passport.activated_by_user_id == user_id).order_by(Passport.created_at.desc())))


def get_user_passport(db: Session, user_id: int, passport_id: int) -> Passport | None:
    return db.scalar(select(Passport).where(Passport.id == passport_id, Passport.activated_by_user_id == user_id))


def count_valid_stamps(db: Session, passport_id: int) -> int:
    query = select(func.count(Stamp.id)).where(Stamp.passport_id == passport_id, Stamp.validation_status == "valid")
    return int(db.scalar(query) or 0)


def get_valid_stamp(db: Session, passport_id: int, stamp_point_id: int) -> Stamp | None:
    return db.scalar(
        select(Stamp).where(
            Stamp.passport_id == passport_id,
            Stamp.stamp_point_id == stamp_point_id,
            Stamp.validation_status == "valid",
        )
    )


def list_passport_stamps(db: Session, passport_id: int) -> list[Stamp]:
    return list(db.scalars(select(Stamp).where(Stamp.passport_id == passport_id).order_by(Stamp.stamped_at.asc())))


def get_stamp_point_by_public_code(db: Session, public_code: str) -> StampPoint | None:
    return db.scalar(select(StampPoint).where(StampPoint.qr_public_code == public_code))

