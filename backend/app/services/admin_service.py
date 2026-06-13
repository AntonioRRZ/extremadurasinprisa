from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Order, Passport, PassportType, Route, Stamp, StampPoint, User
from app.repositories import route_repository, user_repository
from app.schemas.admin import (
    PassportTypeCreateRequest,
    PassportTypeUpdateRequest,
    PassportUpdateRequest,
    RouteCreateRequest,
    RouteUpdateRequest,
    StampPointCreateRequest,
    StampPointUpdateRequest,
    UserUpdateRequest,
)
from app.services.audit import record_audit
from app.services.utils import build_stamp_qr_payload, generate_stamp_secret, hash_value


def dashboard_summary(db: Session) -> dict:
    return {
        "users": int(db.scalar(select(func.count(User.id))) or 0),
        "routes": int(db.scalar(select(func.count(Route.id))) or 0),
        "paid_orders": int(db.scalar(select(func.count(Order.id)).where(Order.status == "paid")) or 0),
        "active_passports": int(db.scalar(select(func.count(Passport.id)).where(Passport.operational_status.in_(["active", "completed"]))) or 0),
        "stamps": int(db.scalar(select(func.count(Stamp.id)).where(Stamp.validation_status == "valid")) or 0),
    }


def update_user(db: Session, user_id: int, payload: UserUpdateRequest, actor_user_id: int) -> User:
    user = user_repository.get_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    record_audit(db, "admin.user_updated", "user", str(user.id), actor_user_id=actor_user_id)
    db.commit()
    db.refresh(user)
    return user


def create_route(db: Session, payload: RouteCreateRequest, actor_user_id: int) -> Route:
    route = Route(**payload.model_dump())
    db.add(route)
    db.commit()
    db.refresh(route)
    record_audit(db, "admin.route_created", "route", str(route.id), actor_user_id=actor_user_id)
    db.commit()
    return route


def update_route(db: Session, route_id: int, payload: RouteUpdateRequest, actor_user_id: int) -> Route:
    route = route_repository.get_route_by_id(db, route_id)
    if route is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(route, field, value)
    record_audit(db, "admin.route_updated", "route", str(route.id), actor_user_id=actor_user_id)
    db.commit()
    db.refresh(route)
    return route


def create_stamp_point(db: Session, route_id: int, payload: StampPointCreateRequest, actor_user_id: int) -> tuple[StampPoint, str]:
    route = route_repository.get_route_by_id(db, route_id)
    if route is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    secret = generate_stamp_secret()
    public_code = f"{route.slug}-{payload.slug}-{generate_stamp_secret()[:8]}".upper().replace("_", "-")
    stamp_point = StampPoint(
        route_id=route_id,
        qr_public_code=public_code,
        qr_secret_hash=hash_value(secret),
        **payload.model_dump(),
    )
    db.add(stamp_point)
    db.commit()
    db.refresh(stamp_point)
    record_audit(db, "admin.stamp_point_created", "stamp_point", str(stamp_point.id), actor_user_id=actor_user_id)
    db.commit()
    return stamp_point, build_stamp_qr_payload(public_code, secret)


def update_stamp_point(db: Session, stamp_point_id: int, payload: StampPointUpdateRequest, actor_user_id: int) -> StampPoint:
    stamp_point = db.get(StampPoint, stamp_point_id)
    if stamp_point is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp point not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(stamp_point, field, value)
    record_audit(db, "admin.stamp_point_updated", "stamp_point", str(stamp_point.id), actor_user_id=actor_user_id)
    db.commit()
    db.refresh(stamp_point)
    return stamp_point


def regenerate_stamp_point_qr(db: Session, stamp_point_id: int, actor_user_id: int) -> tuple[StampPoint, str]:
    stamp_point = db.get(StampPoint, stamp_point_id)
    if stamp_point is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp point not found")
    secret = generate_stamp_secret()
    stamp_point.qr_secret_hash = hash_value(secret)
    record_audit(db, "admin.stamp_point_qr_regenerated", "stamp_point", str(stamp_point.id), actor_user_id=actor_user_id)
    db.commit()
    db.refresh(stamp_point)
    return stamp_point, build_stamp_qr_payload(stamp_point.qr_public_code, secret)


def create_passport_type(db: Session, payload: PassportTypeCreateRequest, actor_user_id: int) -> PassportType:
    passport_type = PassportType(**payload.model_dump())
    db.add(passport_type)
    db.commit()
    db.refresh(passport_type)
    record_audit(db, "admin.passport_type_created", "passport_type", str(passport_type.id), actor_user_id=actor_user_id)
    db.commit()
    return passport_type


def update_passport_type(db: Session, passport_type_id: int, payload: PassportTypeUpdateRequest, actor_user_id: int) -> PassportType:
    passport_type = db.get(PassportType, passport_type_id)
    if passport_type is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport type not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(passport_type, field, value)
    record_audit(db, "admin.passport_type_updated", "passport_type", str(passport_type.id), actor_user_id=actor_user_id)
    db.commit()
    db.refresh(passport_type)
    return passport_type


def update_passport(db: Session, passport_id: int, payload: PassportUpdateRequest, actor_user_id: int) -> Passport:
    passport = db.get(Passport, passport_id)
    if passport is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(passport, field, value)
    record_audit(db, "admin.passport_updated", "passport", str(passport.id), actor_user_id=actor_user_id)
    db.commit()
    db.refresh(passport)
    return passport

