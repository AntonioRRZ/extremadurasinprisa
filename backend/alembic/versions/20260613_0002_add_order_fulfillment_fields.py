"""Add order fulfillment fields

Revision ID: 20260613_0002
Revises: 20260612_0001
Create Date: 2026-06-13
"""

from alembic import op
import sqlalchemy as sa


revision = "20260613_0002"
down_revision = "20260612_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("fulfillment_status", sa.String(length=20), nullable=True))
    op.add_column("orders", sa.Column("tracking_code", sa.String(length=120), nullable=True))
    op.add_column("orders", sa.Column("shipped_at", sa.DateTime(), nullable=True))
    op.add_column("orders", sa.Column("delivered_at", sa.DateTime(), nullable=True))
    op.add_column("orders", sa.Column("admin_notes", sa.Text(), nullable=True))
    op.execute("UPDATE orders SET fulfillment_status = 'received' WHERE fulfillment_status IS NULL")
    with op.batch_alter_table("orders") as batch_op:
        batch_op.alter_column("fulfillment_status", existing_type=sa.String(length=20), nullable=False)


def downgrade() -> None:
    op.drop_column("orders", "admin_notes")
    op.drop_column("orders", "delivered_at")
    op.drop_column("orders", "shipped_at")
    op.drop_column("orders", "tracking_code")
    op.drop_column("orders", "fulfillment_status")
