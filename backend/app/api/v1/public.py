from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import PassportTypeSummary, PublicStampPoint, RouteDetail, RouteSummary
from app.services import public_service

router = APIRouter()


@router.get("/routes", response_model=list[RouteSummary])
def list_routes(db: Session = Depends(get_db)):
    return public_service.get_published_routes(db)


@router.get("/routes/{slug}", response_model=RouteDetail)
def route_detail(slug: str, db: Session = Depends(get_db)):
    return public_service.get_public_route(db, slug)


@router.get("/routes/{slug}/passport-types", response_model=list[PassportTypeSummary])
def route_passport_types(slug: str, db: Session = Depends(get_db)):
    return public_service.get_public_route_passport_types(db, slug)


@router.get("/routes/{slug}/stamp-points/public", response_model=list[PublicStampPoint])
def public_stamp_points(slug: str, db: Session = Depends(get_db)):
    return public_service.get_public_route_stamp_points(db, slug)

