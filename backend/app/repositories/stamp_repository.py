from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Passport, Route, Stamp, StampPoint, User


def list_admin_stamps(
    db: Session,
    *,
    scan_source: str | None = None,
    user_id: int | None = None,
    passport_id: int | None = None,
    stamp_point_id: int | None = None,
) -> list[Stamp]:
    query = (
        select(Stamp)
        .options(
            selectinload(Stamp.user),
            selectinload(Stamp.stamp_point),
            selectinload(Stamp.passport).selectinload(Passport.route),
            selectinload(Stamp.passport).selectinload(Passport.passport_type),
            selectinload(Stamp.passport).selectinload(Passport.activated_by_user),
        )
        .order_by(Stamp.stamped_at.desc(), Stamp.id.desc())
    )

    if scan_source is not None:
        query = query.where(Stamp.scan_source == scan_source)
    if user_id is not None:
        query = query.where(Stamp.user_id == user_id)
    if passport_id is not None:
        query = query.where(Stamp.passport_id == passport_id)
    if stamp_point_id is not None:
        query = query.where(Stamp.stamp_point_id == stamp_point_id)

    return list(db.scalars(query))
