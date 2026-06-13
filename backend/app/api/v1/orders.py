from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.orders import OrderCreateRequest, OrderCreateResponse
from app.security.deps import get_optional_user
from app.services import order_service
from app.services.serializers import serialize_order

router = APIRouter()


@router.post("/orders", response_model=OrderCreateResponse)
def create_order(payload: OrderCreateRequest, db: Session = Depends(get_db), user=Depends(get_optional_user)):
    order = order_service.create_order(db, payload, buyer_user_id=user.id if user else None)
    return OrderCreateResponse(order=serialize_order(order))

