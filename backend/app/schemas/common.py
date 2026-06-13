from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr


class ApiMessage(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    app: str


class UserSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    phone: str | None
    role: str
    is_active: bool
    created_at: datetime


class RouteSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    subtitle: str
    description_short: str
    province_scope: str
    distance_km: int
    estimated_days_min: int
    estimated_days_max: int
    hero_image_url: str
    status: str
    min_stamps_to_complete: int


class RouteDetail(RouteSummary):
    description_long: str
    public_teaser_enabled: bool
    private_map_enabled: bool


class PublicStampPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description_public: str
    category: str
    city: str
    province: str
    lat: Decimal
    lng: Decimal
    is_public_preview: bool


class PrivateStampPoint(PublicStampPoint):
    address: str
    description_private: str
    is_active: bool


class PublicInterestPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    point_type: str
    summary: str
    city: str
    province: str
    lat: Decimal
    lng: Decimal
    is_public_preview: bool


class PrivateInterestPoint(PublicInterestPoint):
    description: str
    address: str
    website_url: str | None
    contact_phone: str | None
    schedule_notes: str | None
    parking_notes: str | None
    access_notes: str | None
    pet_friendly: bool
    is_active: bool
    sort_order: int


class PassportTypeSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    route_id: int
    code: str
    name: str
    description: str
    price_cents: int
    currency: str
    max_holders: int
    holder_type: str
    is_physical: bool
    is_active: bool
    sort_order: int


class StampSummary(BaseModel):
    id: int
    stamp_point_id: int
    stamp_point_name: str
    stamped_at: datetime
    validation_status: str
    scan_source: str


class PassportSummary(BaseModel):
    id: int
    route_id: int
    route_title: str
    passport_type_name: str
    serial_number: str
    owner_display_name: str | None
    start_date: date | None
    operational_status: str
    stamp_status: str
    activated_at: datetime | None
    completed_at: datetime | None
    stamps_count: int
    required_stamps: int
    progress_percent: int


class OrderItemSummary(BaseModel):
    id: int
    route_id: int
    route_title: str
    passport_type_id: int
    passport_type_name: str
    quantity: int
    unit_price_cents: int
    total_cents: int


class OrderSummary(BaseModel):
    id: int
    buyer_email: EmailStr
    buyer_name: str
    buyer_phone: str | None
    status: str
    fulfillment_status: str
    tracking_code: str | None
    shipped_at: datetime | None
    delivered_at: datetime | None
    total_cents: int
    currency: str
    created_at: datetime
    items: list[OrderItemSummary]


class PaymentSummary(BaseModel):
    id: int
    order_id: int
    provider: str
    method: str
    amount_cents: int
    currency: str
    status: str
