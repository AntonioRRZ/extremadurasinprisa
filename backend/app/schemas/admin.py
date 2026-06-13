from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import OrderSummary, PassportSummary, PassportTypeSummary, PaymentSummary, PrivateInterestPoint, PrivateStampPoint, RouteDetail, StampSummary, UserSummary


class AdminSummary(BaseModel):
    users: int
    routes: int
    orders: int
    active_passports: int
    stamps: int


class AdminStampActor(BaseModel):
    id: int
    email: str
    full_name: str


class UserUpdateRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None
    is_active: bool | None = None


class RouteCreateRequest(BaseModel):
    slug: str
    title: str
    subtitle: str
    description_short: str
    description_long: str
    province_scope: str
    distance_km: int
    estimated_days_min: int
    estimated_days_max: int
    hero_image_url: str
    status: str = "draft"
    public_teaser_enabled: bool = True
    private_map_enabled: bool = True
    min_stamps_to_complete: int = 4


class RouteUpdateRequest(BaseModel):
    slug: str | None = None
    title: str | None = None
    subtitle: str | None = None
    description_short: str | None = None
    description_long: str | None = None
    province_scope: str | None = None
    distance_km: int | None = None
    estimated_days_min: int | None = None
    estimated_days_max: int | None = None
    hero_image_url: str | None = None
    status: str | None = None
    public_teaser_enabled: bool | None = None
    private_map_enabled: bool | None = None
    min_stamps_to_complete: int | None = None


class StampPointCreateRequest(BaseModel):
    name: str
    slug: str
    description_public: str
    description_private: str
    category: str
    address: str
    city: str
    province: str
    lat: float
    lng: float
    is_active: bool = True
    is_public_preview: bool = False


class StampPointUpdateRequest(BaseModel):
    name: str | None = None
    slug: str | None = None
    description_public: str | None = None
    description_private: str | None = None
    category: str | None = None
    address: str | None = None
    city: str | None = None
    province: str | None = None
    lat: float | None = None
    lng: float | None = None
    is_active: bool | None = None
    is_public_preview: bool | None = None


class StampPointAdminResponse(BaseModel):
    stamp_point: PrivateStampPoint
    qr_value: str


class InterestPointCreateRequest(BaseModel):
    name: str
    slug: str
    point_type: str
    summary: str
    description: str
    address: str
    city: str
    province: str
    lat: float
    lng: float
    website_url: str | None = None
    contact_phone: str | None = None
    schedule_notes: str | None = None
    parking_notes: str | None = None
    access_notes: str | None = None
    pet_friendly: bool = False
    is_public_preview: bool = True
    is_active: bool = True
    sort_order: int = 0


class InterestPointUpdateRequest(BaseModel):
    name: str | None = None
    slug: str | None = None
    point_type: str | None = None
    summary: str | None = None
    description: str | None = None
    address: str | None = None
    city: str | None = None
    province: str | None = None
    lat: float | None = None
    lng: float | None = None
    website_url: str | None = None
    contact_phone: str | None = None
    schedule_notes: str | None = None
    parking_notes: str | None = None
    access_notes: str | None = None
    pet_friendly: bool | None = None
    is_public_preview: bool | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class PassportTypeCreateRequest(BaseModel):
    route_id: int
    code: str
    name: str
    description: str
    price_cents: int
    currency: str = "EUR"
    max_holders: int = 1
    holder_type: str
    is_physical: bool = True
    is_active: bool = True
    sort_order: int = 0


class PassportTypeUpdateRequest(BaseModel):
    route_id: int | None = None
    code: str | None = None
    name: str | None = None
    description: str | None = None
    price_cents: int | None = None
    currency: str | None = None
    max_holders: int | None = None
    holder_type: str | None = None
    is_physical: bool | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class PassportUpdateRequest(BaseModel):
    owner_display_name: str | None = None
    operational_status: str | None = None
    stamp_status: str | None = None


class ManualStampRequest(BaseModel):
    stamp_point_id: int


class AdminUsersResponse(BaseModel):
    users: list["AdminUserListItem"]


class AdminActivePassportListItem(BaseModel):
    passport: PassportSummary
    user: UserSummary
    last_stamp: StampSummary | None
    last_stamp_point: PrivateStampPoint | None


class AdminActivePassportDetail(BaseModel):
    passport: PassportSummary
    user: UserSummary
    route: RouteDetail
    stamp_points: list[PrivateStampPoint]
    stamps: list[StampSummary]
    last_stamp: StampSummary | None
    last_stamp_point: PrivateStampPoint | None


class AdminRoutesResponse(BaseModel):
    routes: list[RouteDetail]


class AdminStampPointsResponse(BaseModel):
    stamp_points: list[PrivateStampPoint]


class AdminInterestPointsResponse(BaseModel):
    interest_points: list[PrivateInterestPoint]


class AdminPassportTypesResponse(BaseModel):
    passport_types: list[PassportTypeSummary]


class AdminPassportsResponse(BaseModel):
    passports: list[PassportSummary]


class AdminOrderSummary(OrderSummary):
    admin_notes: str | None


class AdminOrderPassportSummary(BaseModel):
    id: int
    serial_number: str
    passport_type_name: str
    operational_status: str
    activated_at: datetime | None
    activated_by_user_id: int | None
    activated_by_user_name: str | None
    activated_by_user_email: str | None


class AdminOrderDetail(AdminOrderSummary):
    payments: list[PaymentSummary]
    passports: list[AdminOrderPassportSummary]


class AdminOrderUpdateRequest(BaseModel):
    fulfillment_status: str | None = None
    tracking_code: str | None = None
    admin_notes: str | None = None


class AdminOrdersResponse(BaseModel):
    orders: list[AdminOrderSummary]


class AdminActivePassportsResponse(BaseModel):
    passports: list[AdminActivePassportListItem]


class AdminStampEvent(BaseModel):
    stamp_id: int
    stamped_at: datetime
    validation_status: str
    scan_source: str
    audit_action: str | None
    route_id: int
    route_title: str
    passport_id: int
    passport_serial_number: str
    passport_owner_name: str | None
    passport_type_name: str
    stamp_point_id: int
    stamp_point_name: str
    stamp_point_city: str
    stamp_point_province: str
    traveler_user: AdminStampActor
    recorded_by_user: AdminStampActor | None


class AdminStampsResponse(BaseModel):
    stamps: list[AdminStampEvent]
    total: int
    qr_scan_count: int
    manual_count: int


class AdminUserListItem(UserSummary):
    passport_status: str
    active_passports_count: int
    last_route_title: str | None
    last_stamp_at: datetime | None


class AdminUserPassportDetail(BaseModel):
    passport: PassportSummary
    route: RouteDetail
    stamp_points: list[PrivateStampPoint]
    stamps: list[StampSummary]


class AdminUserDetail(BaseModel):
    user: UserSummary
    passport_status: str
    active_passports_count: int
    total_stamps: int
    orders: list[OrderSummary]
    passport_details: list[AdminUserPassportDetail]
