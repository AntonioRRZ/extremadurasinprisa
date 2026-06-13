from pydantic import BaseModel

from app.schemas.common import OrderSummary, PassportSummary, PassportTypeSummary, PrivateStampPoint, RouteDetail, UserSummary


class AdminSummary(BaseModel):
    users: int
    routes: int
    orders: int
    active_passports: int
    stamps: int


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
    users: list[UserSummary]


class AdminRoutesResponse(BaseModel):
    routes: list[RouteDetail]


class AdminStampPointsResponse(BaseModel):
    stamp_points: list[PrivateStampPoint]


class AdminPassportTypesResponse(BaseModel):
    passport_types: list[PassportTypeSummary]


class AdminPassportsResponse(BaseModel):
    passports: list[PassportSummary]


class AdminOrderSummary(OrderSummary):
    admin_notes: str | None


class AdminOrdersResponse(BaseModel):
    orders: list[AdminOrderSummary]
