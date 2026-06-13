from __future__ import annotations

from datetime import UTC, date, datetime
from decimal import Decimal

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC).replace(tzinfo=None))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC).replace(tzinfo=None),
        onupdate=lambda: datetime.now(UTC).replace(tzinfo=None),
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    role: Mapped[str] = mapped_column(String(20), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    activated_passports: Mapped[list["Passport"]] = relationship(back_populates="activated_by_user")
    stamps: Mapped[list["Stamp"]] = relationship(back_populates="user")
    orders: Mapped[list["Order"]] = relationship(back_populates="buyer_user")


class Route(TimestampMixin, Base):
    __tablename__ = "routes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    subtitle: Mapped[str] = mapped_column(String(255))
    description_short: Mapped[str] = mapped_column(Text)
    description_long: Mapped[str] = mapped_column(Text)
    province_scope: Mapped[str] = mapped_column(String(255))
    distance_km: Mapped[int] = mapped_column(Integer)
    estimated_days_min: Mapped[int] = mapped_column(Integer)
    estimated_days_max: Mapped[int] = mapped_column(Integer)
    hero_image_url: Mapped[str] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(20), default="draft")
    public_teaser_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    private_map_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    min_stamps_to_complete: Mapped[int] = mapped_column(Integer, default=4)

    stamp_points: Mapped[list["StampPoint"]] = relationship(back_populates="route", cascade="all, delete-orphan")
    interest_points: Mapped[list["InterestPoint"]] = relationship(back_populates="route", cascade="all, delete-orphan")
    passport_types: Mapped[list["PassportType"]] = relationship(back_populates="route", cascade="all, delete-orphan")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="route")
    passports: Mapped[list["Passport"]] = relationship(back_populates="route")


class StampPoint(TimestampMixin, Base):
    __tablename__ = "stamp_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(120))
    description_public: Mapped[str] = mapped_column(Text)
    description_private: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(120))
    province: Mapped[str] = mapped_column(String(120))
    lat: Mapped[Decimal] = mapped_column(Numeric(10, 6))
    lng: Mapped[Decimal] = mapped_column(Numeric(10, 6))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_public_preview: Mapped[bool] = mapped_column(Boolean, default=False)
    qr_public_code: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    qr_secret_hash: Mapped[str] = mapped_column(String(255))

    route: Mapped["Route"] = relationship(back_populates="stamp_points")
    stamps: Mapped[list["Stamp"]] = relationship(back_populates="stamp_point")

    __table_args__ = (UniqueConstraint("route_id", "slug", name="uq_stamp_points_route_slug"),)


class InterestPoint(TimestampMixin, Base):
    __tablename__ = "interest_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(120))
    point_type: Mapped[str] = mapped_column(String(80))
    summary: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    address: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(120))
    province: Mapped[str] = mapped_column(String(120))
    lat: Mapped[Decimal] = mapped_column(Numeric(10, 6))
    lng: Mapped[Decimal] = mapped_column(Numeric(10, 6))
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    schedule_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    parking_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    access_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    pet_friendly: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public_preview: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    route: Mapped["Route"] = relationship(back_populates="interest_points")

    __table_args__ = (UniqueConstraint("route_id", "slug", name="uq_interest_points_route_slug"),)


class PassportType(Base):
    __tablename__ = "passport_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"), index=True)
    code: Mapped[str] = mapped_column(String(80))
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    price_cents: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(10), default="EUR")
    max_holders: Mapped[int] = mapped_column(Integer, default=1)
    holder_type: Mapped[str] = mapped_column(String(30))
    is_physical: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    route: Mapped["Route"] = relationship(back_populates="passport_types")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="passport_type")
    passports: Mapped[list["Passport"]] = relationship(back_populates="passport_type")


class Order(TimestampMixin, Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    buyer_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    buyer_email: Mapped[str] = mapped_column(String(255))
    buyer_name: Mapped[str] = mapped_column(String(255))
    buyer_phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    fulfillment_status: Mapped[str] = mapped_column(String(20), default="received")
    tracking_code: Mapped[str | None] = mapped_column(String(120), nullable=True)
    shipped_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_cents: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(10), default="EUR")

    buyer_user: Mapped["User | None"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    payments: Mapped[list["Payment"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    passports: Mapped[list["Passport"]] = relationship(back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"))
    passport_type_id: Mapped[int] = mapped_column(ForeignKey("passport_types.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price_cents: Mapped[int] = mapped_column(Integer)
    total_cents: Mapped[int] = mapped_column(Integer)

    order: Mapped["Order"] = relationship(back_populates="items")
    route: Mapped["Route"] = relationship(back_populates="order_items")
    passport_type: Mapped["PassportType"] = relationship(back_populates="order_items")


class Passport(TimestampMixin, Base):
    __tablename__ = "passports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"), index=True)
    passport_type_id: Mapped[int] = mapped_column(ForeignKey("passport_types.id"))
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    activated_by_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    serial_number: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    activation_code: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    owner_display_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    operational_status: Mapped[str] = mapped_column(String(20), default="inactive")
    stamp_status: Mapped[str] = mapped_column(String(30), default="unstamped")
    activated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    route: Mapped["Route"] = relationship(back_populates="passports")
    passport_type: Mapped["PassportType"] = relationship(back_populates="passports")
    order: Mapped["Order"] = relationship(back_populates="passports")
    activated_by_user: Mapped["User | None"] = relationship(back_populates="activated_passports")
    stamps: Mapped[list["Stamp"]] = relationship(back_populates="passport", cascade="all, delete-orphan")


class Stamp(Base):
    __tablename__ = "stamps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    passport_id: Mapped[int] = mapped_column(ForeignKey("passports.id"), index=True)
    stamp_point_id: Mapped[int] = mapped_column(ForeignKey("stamp_points.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    stamped_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC).replace(tzinfo=None))
    validation_status: Mapped[str] = mapped_column(String(20), default="valid")
    scan_source: Mapped[str] = mapped_column(String(20), default="qr_scan")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC).replace(tzinfo=None))

    passport: Mapped["Passport"] = relationship(back_populates="stamps")
    stamp_point: Mapped["StampPoint"] = relationship(back_populates="stamps")
    user: Mapped["User"] = relationship(back_populates="stamps")

    __table_args__ = (UniqueConstraint("passport_id", "stamp_point_id", name="uq_passport_stamp_point"),)


class Payment(TimestampMixin, Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), index=True)
    provider: Mapped[str] = mapped_column(String(30), default="mock")
    method: Mapped[str] = mapped_column(String(30), default="card")
    provider_payment_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    amount_cents: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(10), default="EUR")
    status: Mapped[str] = mapped_column(String(20), default="pending")
    raw_response_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    order: Mapped["Order"] = relationship(back_populates="payments")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(120))
    entity_type: Mapped[str] = mapped_column(String(120))
    entity_id: Mapped[str] = mapped_column(String(120))
    metadata_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC).replace(tzinfo=None))
