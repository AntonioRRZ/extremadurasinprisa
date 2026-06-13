from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import PassportType
from app.repositories import route_repository


def get_published_routes(db: Session):
    return route_repository.list_published_routes(db)


def get_public_route(db: Session, slug: str):
    route = route_repository.get_route_by_slug(db, slug)
    if route is None or route.status != "published":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    return route


def get_public_route_passport_types(db: Session, slug: str) -> list[PassportType]:
    route = get_public_route(db, slug)
    return sorted([passport_type for passport_type in route.passport_types if passport_type.is_active], key=lambda item: item.sort_order)


def get_public_route_stamp_points(db: Session, slug: str):
    route = get_public_route(db, slug)
    return route_repository.list_public_stamp_points(db, route.id)

