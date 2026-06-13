from fastapi import APIRouter

from app.api.v1 import admin, auth, health, me, orders, payments, public

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(public.router, tags=["public"])
api_router.include_router(orders.router, tags=["orders"])
api_router.include_router(payments.router, tags=["payments"])
api_router.include_router(me.router, tags=["me"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

