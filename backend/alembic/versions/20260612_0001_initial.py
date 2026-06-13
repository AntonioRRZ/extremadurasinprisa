"""Initial schema

Revision ID: 20260612_0001
Revises:
Create Date: 2026-06-12
"""

from alembic import op
import sqlalchemy as sa


revision = "20260612_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "routes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("subtitle", sa.String(length=255), nullable=False),
        sa.Column("description_short", sa.Text(), nullable=False),
        sa.Column("description_long", sa.Text(), nullable=False),
        sa.Column("province_scope", sa.String(length=255), nullable=False),
        sa.Column("distance_km", sa.Integer(), nullable=False),
        sa.Column("estimated_days_min", sa.Integer(), nullable=False),
        sa.Column("estimated_days_max", sa.Integer(), nullable=False),
        sa.Column("hero_image_url", sa.String(length=500), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("public_teaser_enabled", sa.Boolean(), nullable=False),
        sa.Column("private_map_enabled", sa.Boolean(), nullable=False),
        sa.Column("min_stamps_to_complete", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_routes_slug"), "routes", ["slug"], unique=True)

    op.create_table(
        "stamp_points",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("description_public", sa.Text(), nullable=False),
        sa.Column("description_private", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("address", sa.String(length=255), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("province", sa.String(length=120), nullable=False),
        sa.Column("lat", sa.Numeric(10, 6), nullable=False),
        sa.Column("lng", sa.Numeric(10, 6), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_public_preview", sa.Boolean(), nullable=False),
        sa.Column("qr_public_code", sa.String(length=120), nullable=False),
        sa.Column("qr_secret_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("route_id", "slug", name="uq_stamp_points_route_slug"),
    )
    op.create_index(op.f("ix_stamp_points_route_id"), "stamp_points", ["route_id"], unique=False)
    op.create_index(op.f("ix_stamp_points_qr_public_code"), "stamp_points", ["qr_public_code"], unique=True)

    op.create_table(
        "passport_types",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id"), nullable=False),
        sa.Column("code", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("price_cents", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=False),
        sa.Column("max_holders", sa.Integer(), nullable=False),
        sa.Column("holder_type", sa.String(length=30), nullable=False),
        sa.Column("is_physical", sa.Boolean(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
    )
    op.create_index(op.f("ix_passport_types_route_id"), "passport_types", ["route_id"], unique=False)

    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("buyer_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("buyer_email", sa.String(length=255), nullable=False),
        sa.Column("buyer_name", sa.String(length=255), nullable=False),
        sa.Column("buyer_phone", sa.String(length=50), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("total_cents", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id"), nullable=False),
        sa.Column("passport_type_id", sa.Integer(), sa.ForeignKey("passport_types.id"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price_cents", sa.Integer(), nullable=False),
        sa.Column("total_cents", sa.Integer(), nullable=False),
    )

    op.create_table(
        "passports",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id"), nullable=False),
        sa.Column("passport_type_id", sa.Integer(), sa.ForeignKey("passport_types.id"), nullable=False),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("activated_by_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("serial_number", sa.String(length=120), nullable=False),
        sa.Column("activation_code", sa.String(length=120), nullable=False),
        sa.Column("owner_display_name", sa.String(length=255), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("operational_status", sa.String(length=20), nullable=False),
        sa.Column("stamp_status", sa.String(length=30), nullable=False),
        sa.Column("activated_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_passports_route_id"), "passports", ["route_id"], unique=False)
    op.create_index(op.f("ix_passports_serial_number"), "passports", ["serial_number"], unique=True)
    op.create_index(op.f("ix_passports_activation_code"), "passports", ["activation_code"], unique=True)

    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("provider", sa.String(length=30), nullable=False),
        sa.Column("method", sa.String(length=30), nullable=False),
        sa.Column("provider_payment_id", sa.String(length=255), nullable=True),
        sa.Column("amount_cents", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("raw_response_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_payments_order_id"), "payments", ["order_id"], unique=False)

    op.create_table(
        "stamps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("passport_id", sa.Integer(), sa.ForeignKey("passports.id"), nullable=False),
        sa.Column("stamp_point_id", sa.Integer(), sa.ForeignKey("stamp_points.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("stamped_at", sa.DateTime(), nullable=False),
        sa.Column("validation_status", sa.String(length=20), nullable=False),
        sa.Column("scan_source", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("passport_id", "stamp_point_id", name="uq_passport_stamp_point"),
    )
    op.create_index(op.f("ix_stamps_passport_id"), "stamps", ["passport_id"], unique=False)
    op.create_index(op.f("ix_stamps_stamp_point_id"), "stamps", ["stamp_point_id"], unique=False)

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("actor_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("action", sa.String(length=120), nullable=False),
        sa.Column("entity_type", sa.String(length=120), nullable=False),
        sa.Column("entity_id", sa.String(length=120), nullable=False),
        sa.Column("metadata_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_index(op.f("ix_stamps_stamp_point_id"), table_name="stamps")
    op.drop_index(op.f("ix_stamps_passport_id"), table_name="stamps")
    op.drop_table("stamps")
    op.drop_index(op.f("ix_payments_order_id"), table_name="payments")
    op.drop_table("payments")
    op.drop_index(op.f("ix_passports_activation_code"), table_name="passports")
    op.drop_index(op.f("ix_passports_serial_number"), table_name="passports")
    op.drop_index(op.f("ix_passports_route_id"), table_name="passports")
    op.drop_table("passports")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_index(op.f("ix_passport_types_route_id"), table_name="passport_types")
    op.drop_table("passport_types")
    op.drop_index(op.f("ix_stamp_points_qr_public_code"), table_name="stamp_points")
    op.drop_index(op.f("ix_stamp_points_route_id"), table_name="stamp_points")
    op.drop_table("stamp_points")
    op.drop_index(op.f("ix_routes_slug"), table_name="routes")
    op.drop_table("routes")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

