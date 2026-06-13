"""Add interest points

Revision ID: 20260613_0003
Revises: 20260613_0002
Create Date: 2026-06-13
"""

from alembic import op
import sqlalchemy as sa


revision = "20260613_0003"
down_revision = "20260613_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "interest_points",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("route_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("point_type", sa.String(length=80), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("address", sa.String(length=255), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("province", sa.String(length=120), nullable=False),
        sa.Column("lat", sa.Numeric(10, 6), nullable=False),
        sa.Column("lng", sa.Numeric(10, 6), nullable=False),
        sa.Column("website_url", sa.String(length=500), nullable=True),
        sa.Column("contact_phone", sa.String(length=50), nullable=True),
        sa.Column("schedule_notes", sa.Text(), nullable=True),
        sa.Column("parking_notes", sa.Text(), nullable=True),
        sa.Column("access_notes", sa.Text(), nullable=True),
        sa.Column("pet_friendly", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_public_preview", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("route_id", "slug", name="uq_interest_points_route_slug"),
    )
    op.create_index(op.f("ix_interest_points_route_id"), "interest_points", ["route_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_interest_points_route_id"), table_name="interest_points")
    op.drop_table("interest_points")
