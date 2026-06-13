from datetime import date

from pydantic import BaseModel

from app.schemas.common import PassportSummary, PrivateStampPoint, RouteDetail, StampSummary


class PassportActivationRequest(BaseModel):
    activation_code: str
    owner_display_name: str | None = None
    start_date: date | None = None


class PassportDetailResponse(BaseModel):
    passport: PassportSummary
    route: RouteDetail
    stamp_points: list[PrivateStampPoint]
    stamps: list[StampSummary]
    common_passport_qr_url: str


class ScanStampRequest(BaseModel):
    qr_code: str


class ScanStampResponse(BaseModel):
    status: str
    passport: PassportSummary
    stamp: StampSummary | None = None
    message: str

