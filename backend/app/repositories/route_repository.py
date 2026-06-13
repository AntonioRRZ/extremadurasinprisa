from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Route, StampPoint


def list_published_routes(db: Session) -> list[Route]:
    return list(db.scalars(select(Route).where(Route.status == "published").order_by(Route.title)))


def get_route_by_slug(db: Session, slug: str) -> Route | None:
    return db.scalar(select(Route).where(Route.slug == slug))


def get_route_by_id(db: Session, route_id: int) -> Route | None:
    return db.get(Route, route_id)


def list_public_stamp_points(db: Session, route_id: int) -> list[StampPoint]:
    query = select(StampPoint).where(
        StampPoint.route_id == route_id,
        StampPoint.is_active.is_(True),
        StampPoint.is_public_preview.is_(True),
    )
    return list(db.scalars(query.order_by(StampPoint.name)))


def list_route_stamp_points(db: Session, route_id: int) -> list[StampPoint]:
    return list(db.scalars(select(StampPoint).where(StampPoint.route_id == route_id).order_by(StampPoint.name)))

