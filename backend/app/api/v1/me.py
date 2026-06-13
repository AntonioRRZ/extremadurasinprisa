from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories import order_repository, route_repository
from app.schemas.common import OrderSummary, PassportSummary, RouteSummary, StampSummary, UserSummary
from app.schemas.passports import PassportActivationRequest, PassportDetailResponse, ScanStampRequest, ScanStampResponse
from app.security.deps import get_current_user
from app.services import passport_service
from app.services.serializers import common_passport_qr_url, serialize_order, serialize_passport_summary, serialize_stamp

router = APIRouter()


@router.get("/me", response_model=UserSummary)
def get_me(user=Depends(get_current_user)):
    return user


@router.get("/me/orders", response_model=list[OrderSummary])
def my_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return [serialize_order(order) for order in order_repository.list_orders_for_user(db, user.id)]


@router.get("/me/routes", response_model=list[RouteSummary])
def my_routes(db: Session = Depends(get_db), user=Depends(get_current_user)):
    passports = passport_service.list_user_passports(db, user.id)
    route_ids = {passport["route_id"] for passport in passports}
    routes = [route_repository.get_route_by_id(db, route_id) for route_id in route_ids]
    return [route for route in routes if route is not None]


@router.post("/me/passports/activate", response_model=PassportSummary)
def activate_passport(payload: PassportActivationRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    passport = passport_service.activate_passport(db, user.id, payload)
    return serialize_passport_summary(db, passport)


@router.get("/me/passports", response_model=list[PassportSummary])
def my_passports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return [PassportSummary.model_validate(item) for item in passport_service.list_user_passports(db, user.id)]


@router.get("/me/passports/{passport_id}", response_model=PassportDetailResponse)
def passport_detail(passport_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    passport = passport_service.get_user_passport_detail(db, user.id, passport_id)
    return PassportDetailResponse(
        passport=serialize_passport_summary(db, passport),
        route=passport.route,
        stamp_points=passport.route.stamp_points,
        stamps=[serialize_stamp(stamp) for stamp in passport.stamps],
        common_passport_qr_url=common_passport_qr_url(),
    )


@router.post("/me/passports/{passport_id}/scan", response_model=ScanStampResponse)
def scan_passport(passport_id: int, payload: ScanStampRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    result, passport, stamp, message = passport_service.scan_stamp(db, user.id, passport_id, payload)
    return ScanStampResponse(
        status=result,
        passport=serialize_passport_summary(db, passport),
        stamp=serialize_stamp(stamp) if stamp else None,
        message=message,
    )


@router.get("/me/passports/{passport_id}/stamps", response_model=list[StampSummary])
def passport_stamps(passport_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    passport = passport_service.get_user_passport_detail(db, user.id, passport_id)
    return [serialize_stamp(stamp) for stamp in passport.stamps]
