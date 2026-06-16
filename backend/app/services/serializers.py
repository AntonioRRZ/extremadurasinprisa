from app.core.config import settings
from app.models import Order, Passport, Payment, Stamp
from app.schemas.admin import AdminOrderDetail, AdminOrderPassportSummary, AdminOrderSummary
from app.schemas.common import OrderItemSummary, OrderSummary, PassportSummary, PaymentSummary, StampSummary
from app.services.passport_service import passport_to_summary


def serialize_order(order: Order) -> OrderSummary:
    items = [
        OrderItemSummary(
            id=item.id,
            route_id=item.route_id,
            route_title=item.route.title,
            passport_type_id=item.passport_type_id,
            passport_type_name=item.passport_type.name,
            quantity=item.quantity,
            unit_price_cents=item.unit_price_cents,
            total_cents=item.total_cents,
        )
        for item in order.items
    ]
    return OrderSummary(
        id=order.id,
        buyer_email=order.buyer_email,
        buyer_name=order.buyer_name,
        buyer_phone=order.buyer_phone,
        status=order.status,
        fulfillment_status=order.fulfillment_status,
        tracking_code=order.tracking_code,
        shipped_at=order.shipped_at,
        delivered_at=order.delivered_at,
        total_cents=order.total_cents,
        currency=order.currency,
        created_at=order.created_at,
        items=items,
    )


def serialize_admin_order(order: Order) -> AdminOrderSummary:
    summary = serialize_order(order)
    return AdminOrderSummary(
        **summary.model_dump(),
        admin_notes=order.admin_notes,
    )


def serialize_admin_order_detail(order: Order) -> AdminOrderDetail:
    summary = serialize_admin_order(order)
    passports = [
        AdminOrderPassportSummary(
            id=passport.id,
            serial_number=passport.serial_number,
            activation_code=passport.activation_code,
            passport_type_name=passport.passport_type.name,
            operational_status=passport.operational_status,
            activated_at=passport.activated_at,
            activated_by_user_id=passport.activated_by_user_id,
            activated_by_user_name=passport.activated_by_user.full_name if passport.activated_by_user else None,
            activated_by_user_email=passport.activated_by_user.email if passport.activated_by_user else None,
        )
        for passport in order.passports
    ]
    return AdminOrderDetail(
        **summary.model_dump(),
        payments=[serialize_payment(payment) for payment in order.payments],
        passports=passports,
        common_passport_qr_url=common_passport_qr_url(),
    )


def serialize_payment(payment: Payment) -> PaymentSummary:
    return PaymentSummary(
        id=payment.id,
        order_id=payment.order_id,
        provider=payment.provider,
        method=payment.method,
        amount_cents=payment.amount_cents,
        currency=payment.currency,
        status=payment.status,
    )


def serialize_passport_summary(db, passport: Passport) -> PassportSummary:
    return PassportSummary.model_validate(passport_to_summary(db, passport))


def serialize_stamp(stamp: Stamp) -> StampSummary:
    return StampSummary(
        id=stamp.id,
        stamp_point_id=stamp.stamp_point_id,
        stamp_point_name=stamp.stamp_point.name,
        stamped_at=stamp.stamped_at,
        validation_status=stamp.validation_status,
        scan_source=stamp.scan_source,
    )


def common_passport_qr_url() -> str:
    return settings.common_passport_qr_url or settings.frontend_url
