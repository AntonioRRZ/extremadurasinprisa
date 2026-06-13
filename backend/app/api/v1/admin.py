from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Passport, PassportType, Route
from app.repositories import order_repository, route_repository
from app.schemas.admin import (
    AdminActivePassportDetail,
    AdminActivePassportsResponse,
    AdminInterestPointsResponse,
    AdminOrderDetail,
    AdminOrderUpdateRequest,
    AdminOrdersResponse,
    AdminPassportsResponse,
    AdminPassportTypesResponse,
    AdminRoutesResponse,
    AdminStampPointsResponse,
    AdminSummary,
    AdminUserDetail,
    AdminUsersResponse,
    InterestPointCreateRequest,
    InterestPointUpdateRequest,
    ManualStampRequest,
    PassportTypeCreateRequest,
    PassportTypeUpdateRequest,
    PassportUpdateRequest,
    RouteCreateRequest,
    RouteUpdateRequest,
    StampPointAdminResponse,
    StampPointCreateRequest,
    StampPointUpdateRequest,
    UserUpdateRequest,
)
from app.schemas.common import PassportSummary, PassportTypeSummary, PrivateInterestPoint, PrivateStampPoint, RouteDetail, UserSummary
from app.security.deps import get_current_admin
from app.services import admin_service, passport_service
from app.services.serializers import serialize_admin_order, serialize_admin_order_detail, serialize_passport_summary

router = APIRouter()


@router.get("/dashboard/summary", response_model=AdminSummary)
def dashboard_summary(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.dashboard_summary(db)


@router.get("/users", response_model=AdminUsersResponse)
def admin_users(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminUsersResponse(users=admin_service.list_admin_users(db))


@router.get("/users/{user_id}", response_model=AdminUserDetail)
def admin_user_detail(user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.get_admin_user_detail(db, user_id)


@router.patch("/users/{user_id}", response_model=UserSummary)
def update_user(user_id: int, payload: UserUpdateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    user = admin_service.update_user(db, user_id, payload, admin.id)
    return user


@router.get("/routes", response_model=AdminRoutesResponse)
def admin_routes(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminRoutesResponse(routes=list(db.query(Route).order_by(Route.created_at.desc())))


@router.post("/routes", response_model=RouteDetail)
def create_route(payload: RouteCreateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.create_route(db, payload, admin.id)


@router.get("/routes/{route_id}", response_model=RouteDetail)
def get_route(route_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    route = route_repository.get_route_by_id(db, route_id)
    return route


@router.patch("/routes/{route_id}", response_model=RouteDetail)
def update_route(route_id: int, payload: RouteUpdateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.update_route(db, route_id, payload, admin.id)


@router.get("/routes/{route_id}/stamp-points", response_model=AdminStampPointsResponse)
def route_stamp_points(route_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminStampPointsResponse(stamp_points=route_repository.list_route_stamp_points(db, route_id))


@router.post("/routes/{route_id}/stamp-points", response_model=StampPointAdminResponse)
def create_stamp_point(route_id: int, payload: StampPointCreateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    stamp_point, qr_value = admin_service.create_stamp_point(db, route_id, payload, admin.id)
    return StampPointAdminResponse(stamp_point=stamp_point, qr_value=qr_value)


@router.get("/routes/{route_id}/interest-points", response_model=AdminInterestPointsResponse)
def route_interest_points(route_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminInterestPointsResponse(interest_points=route_repository.list_route_interest_points(db, route_id))


@router.post("/routes/{route_id}/interest-points", response_model=PrivateInterestPoint)
def create_interest_point(route_id: int, payload: InterestPointCreateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.create_interest_point(db, route_id, payload, admin.id)


@router.patch("/stamp-points/{stamp_point_id}", response_model=PrivateStampPoint)
def update_stamp_point(stamp_point_id: int, payload: StampPointUpdateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.update_stamp_point(db, stamp_point_id, payload, admin.id)


@router.patch("/interest-points/{interest_point_id}", response_model=PrivateInterestPoint)
def update_interest_point(interest_point_id: int, payload: InterestPointUpdateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.update_interest_point(db, interest_point_id, payload, admin.id)


@router.post("/stamp-points/{stamp_point_id}/regenerate-qr", response_model=StampPointAdminResponse)
def regenerate_qr(stamp_point_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    stamp_point, qr_value = admin_service.regenerate_stamp_point_qr(db, stamp_point_id, admin.id)
    return StampPointAdminResponse(stamp_point=stamp_point, qr_value=qr_value)


@router.get("/passport-types", response_model=AdminPassportTypesResponse)
def admin_passport_types(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminPassportTypesResponse(passport_types=list(db.query(PassportType).order_by(PassportType.sort_order.asc())))


@router.post("/passport-types", response_model=PassportTypeSummary)
def create_passport_type(payload: PassportTypeCreateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.create_passport_type(db, payload, admin.id)


@router.patch("/passport-types/{passport_type_id}", response_model=PassportTypeSummary)
def update_passport_type(passport_type_id: int, payload: PassportTypeUpdateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.update_passport_type(db, passport_type_id, payload, admin.id)


@router.get("/passports", response_model=AdminPassportsResponse)
def admin_passports(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    passports = list(db.query(Passport).order_by(Passport.created_at.desc()))
    return AdminPassportsResponse(passports=[serialize_passport_summary(db, passport) for passport in passports])


@router.get("/active-passports", response_model=AdminActivePassportsResponse)
def admin_active_passports(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminActivePassportsResponse(passports=admin_service.list_admin_active_passports(db))


@router.get("/active-passports/{passport_id}", response_model=AdminActivePassportDetail)
def admin_active_passport_detail(passport_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return admin_service.get_admin_active_passport_detail(db, passport_id)


@router.patch("/passports/{passport_id}", response_model=PassportSummary)
def update_passport(passport_id: int, payload: PassportUpdateRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    passport = admin_service.update_passport(db, passport_id, payload, admin.id)
    return serialize_passport_summary(db, passport)


@router.post("/passports/{passport_id}/manual-stamp", response_model=PassportSummary)
def manual_stamp(passport_id: int, payload: ManualStampRequest, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    passport = passport_service.manual_stamp(db, admin.id, passport_id, payload.stamp_point_id)
    return serialize_passport_summary(db, passport)


@router.get("/orders", response_model=AdminOrdersResponse)
def admin_orders(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return AdminOrdersResponse(orders=[serialize_admin_order(order) for order in order_repository.list_orders(db)])


@router.get("/orders/{order_id}", response_model=AdminOrderDetail)
def admin_order_detail(order_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    order = admin_service.get_order_or_404(db, order_id)
    return serialize_admin_order_detail(order)


@router.patch("/orders/{order_id}", response_model=AdminOrderDetail)
def admin_update_order(
    order_id: int,
    payload: AdminOrderUpdateRequest,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    order = admin_service.update_order(db, order_id, payload, admin.id)
    return serialize_admin_order_detail(order)
