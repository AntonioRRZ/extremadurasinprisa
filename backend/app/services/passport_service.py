from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Passport, Stamp, StampPoint
from app.repositories import passport_repository, route_repository
from app.schemas.passports import PassportActivationRequest, ScanStampRequest
from app.services.audit import record_audit
from app.services.utils import build_stamp_qr_payload, hash_value


def _build_passport_summary(passport: Passport, stamps_count: int):
    required_stamps = passport.route.min_stamps_to_complete
    progress_percent = min(100, int((stamps_count / max(required_stamps, 1)) * 100))
    return {
        "id": passport.id,
        "route_id": passport.route_id,
        "route_title": passport.route.title,
        "passport_type_name": passport.passport_type.name,
        "serial_number": passport.serial_number,
        "owner_display_name": passport.owner_display_name,
        "start_date": passport.start_date,
        "operational_status": passport.operational_status,
        "stamp_status": passport.stamp_status,
        "activated_at": passport.activated_at,
        "completed_at": passport.completed_at,
        "stamps_count": stamps_count,
        "required_stamps": required_stamps,
        "progress_percent": progress_percent,
    }


def passport_to_summary(db: Session, passport: Passport):
    return _build_passport_summary(passport, passport_repository.count_valid_stamps(db, passport.id))


def list_user_passports(db: Session, user_id: int) -> list[dict]:
    passports = passport_repository.list_user_passports(db, user_id)
    return [passport_to_summary(db, passport) for passport in passports]


def activate_passport(db: Session, user_id: int, payload: PassportActivationRequest) -> Passport:
    passport = passport_repository.get_by_activation_code(db, payload.activation_code.strip().upper())
    if passport is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activation code not found")
    if passport.activated_by_user_id and passport.activated_by_user_id != user_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Passport already activated")
    if passport.operational_status == "cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passport is cancelled")

    passport.activated_by_user_id = user_id
    passport.owner_display_name = payload.owner_display_name or passport.owner_display_name
    passport.start_date = payload.start_date or passport.start_date
    passport.operational_status = "active"
    passport.activated_at = datetime.now(UTC).replace(tzinfo=None)
    db.commit()
    db.refresh(passport)
    record_audit(db, "passport.activated", "passport", str(passport.id), actor_user_id=user_id)
    db.commit()
    return passport


def get_user_passport_detail(db: Session, user_id: int, passport_id: int) -> Passport:
    passport = passport_repository.get_user_passport(db, user_id, passport_id)
    if passport is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    return passport


def parse_stamp_qr_payload(payload: str) -> tuple[str, str]:
    pieces = payload.split("|")
    if len(pieces) != 3 or pieces[0] != "ESPSTAMP":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid QR payload")
    return pieces[1], pieces[2]


def recalculate_passport_progress(db: Session, passport: Passport) -> Passport:
    count = passport_repository.count_valid_stamps(db, passport.id)
    minimum = passport.route.min_stamps_to_complete
    if count == 0:
        passport.stamp_status = "unstamped"
    elif count < minimum:
        passport.stamp_status = "partially_stamped"
    else:
        passport.stamp_status = "fully_stamped"
        passport.operational_status = "completed"
        passport.completed_at = datetime.now(UTC).replace(tzinfo=None)
    db.flush()
    return passport


def scan_stamp(db: Session, user_id: int, passport_id: int, payload: ScanStampRequest) -> tuple[str, Passport, Stamp | None, str]:
    passport = get_user_passport_detail(db, user_id, passport_id)
    if passport.operational_status not in {"active", "completed"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passport is not active")

    public_code, secret = parse_stamp_qr_payload(payload.qr_code)
    stamp_point = passport_repository.get_stamp_point_by_public_code(db, public_code)
    if stamp_point is None or not stamp_point.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp point not found")
    if stamp_point.route_id != passport.route_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stamp point belongs to another route")
    if stamp_point.qr_secret_hash != hash_value(secret):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid QR secret")

    duplicate = passport_repository.get_valid_stamp(db, passport.id, stamp_point.id)
    if duplicate:
        return "duplicate", passport, duplicate, "Este punto ya estaba sellado"

    stamp = Stamp(
        passport_id=passport.id,
        stamp_point_id=stamp_point.id,
        user_id=user_id,
        validation_status="valid",
        scan_source="qr_scan",
    )
    db.add(stamp)
    db.flush()
    recalculate_passport_progress(db, passport)
    record_audit(db, "passport.stamped", "passport", str(passport.id), actor_user_id=user_id, metadata={"stamp_point_id": stamp_point.id})
    db.commit()
    db.refresh(stamp)
    db.refresh(passport)
    return "success", passport, stamp, "Sello registrado correctamente"


def manual_stamp(db: Session, actor_user_id: int, passport_id: int, stamp_point_id: int) -> Passport:
    passport = db.get(Passport, passport_id)
    if passport is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    stamp_point = db.get(StampPoint, stamp_point_id)
    if stamp_point is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp point not found")
    if stamp_point.route_id != passport.route_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stamp point belongs to another route")
    duplicate = passport_repository.get_valid_stamp(db, passport.id, stamp_point_id)
    if duplicate:
        return passport
    db.add(
        Stamp(
            passport_id=passport.id,
            stamp_point_id=stamp_point_id,
            user_id=passport.activated_by_user_id or actor_user_id,
            validation_status="valid",
            scan_source="admin_manual",
        )
    )
    recalculate_passport_progress(db, passport)
    record_audit(db, "passport.manual_stamp", "passport", str(passport.id), actor_user_id=actor_user_id, metadata={"stamp_point_id": stamp_point_id})
    db.commit()
    db.refresh(passport)
    return passport


def build_qr_preview(public_code: str, secret: str) -> str:
    return build_stamp_qr_payload(public_code, secret)
