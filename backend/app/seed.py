from datetime import UTC, date, datetime

import app.db.session as session_module
from app.models import Order, OrderItem, Passport, PassportType, Payment, Route, Stamp, StampPoint, User
from app.security.passwords import hash_password
from app.services.utils import generate_activation_code, generate_serial, generate_stamp_secret, hash_value


def seed() -> None:
    session_module.init_db()
    db = session_module.SessionLocal()
    try:
        if db.query(User).count() > 0:
            return

        admin = User(
            email="admin@example.com",
            password_hash=hash_password("Admin1234!"),
            full_name="Administrador Demo",
            role="admin",
            phone="+34 600 000 001",
            is_active=True,
        )
        user = User(
            email="user@example.com",
            password_hash=hash_password("User1234!"),
            full_name="Viajera Demo",
            role="user",
            phone="+34 600 000 002",
            is_active=True,
        )
        db.add_all([admin, user])
        db.flush()

        route = Route(
            slug="dehesas-y-ciudades-lentas",
            title="Dehesas y ciudades lentas",
            subtitle="Un viaje sereno entre patrimonio, agua y encinas",
            description_short="Ruta editorial por Extremadura para viajar con pausa, dormir mejor y descubrir pueblos con carácter.",
            description_long=(
                "Una ruta pensada para furgonetas camper que enlaza patrimonio, gastronomia local y paisajes abiertos. "
                "El pasaporte fisico activa mapas privados, puntos oficiales y un progreso coleccionable."
            ),
            province_scope="Caceres y Badajoz",
            distance_km=620,
            estimated_days_min=4,
            estimated_days_max=8,
            hero_image_url="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
            status="published",
            public_teaser_enabled=True,
            private_map_enabled=True,
            min_stamps_to_complete=4,
        )
        db.add(route)
        db.flush()

        passport_types = [
            PassportType(route_id=route.id, code="IND", name="Pasaporte Individual", description="Acceso editorial y ruta privada para una persona.", price_cents=1095, max_holders=1, holder_type="individual", sort_order=1),
            PassportType(route_id=route.id, code="PAR", name="Pasaporte Pareja", description="Version para dos viajeros que comparten ruta y recuerdos.", price_cents=1990, max_holders=2, holder_type="pareja", sort_order=2),
            PassportType(route_id=route.id, code="PET", name="Pasaporte Mascota", description="Incluye recomendaciones pet-friendly y extras de viaje.", price_cents=1690, max_holders=2, holder_type="mascota", sort_order=3),
            PassportType(route_id=route.id, code="SUP", name="Super Pasaporte", description="Edicion ampliada con cuaderno de notas y extras privados.", price_cents=1790, max_holders=2, holder_type="premium", sort_order=4),
            PassportType(route_id=route.id, code="TOP", name="Welcome Pack Sierra", description="Pack fisico con guia, pegatina y pasaporte premium.", price_cents=2995, max_holders=2, holder_type="pack", sort_order=5),
            PassportType(route_id=route.id, code="TURBO", name="Welcome Pack Calzada", description="Pack completo para arrancar la ruta desde el primer dia.", price_cents=2995, max_holders=2, holder_type="pack", sort_order=6),
        ]
        db.add_all(passport_types)
        db.flush()

        stamp_points_data = [
            ("Plasencia monumental", "plasencia-monumental", "casco-historico", "Plaza Mayor, Plasencia", "Plasencia", "Caceres", 40.029997, -6.090216, True),
            ("Monfrague al amanecer", "monfrague-amanecer", "naturaleza", "Villarreal de San Carlos", "Serradilla", "Caceres", 39.806030, -6.003530, True),
            ("Trujillo sosegado", "trujillo-sosegado", "patrimonio", "Plaza Mayor, Trujillo", "Trujillo", "Caceres", 39.460697, -5.881482, False),
            ("Merida entre columnas", "merida-columnas", "romano", "Teatro Romano, Merida", "Merida", "Badajoz", 38.916107, -6.343877, True),
            ("Zafra con calma", "zafra-con-calma", "gastronomia", "Plaza Chica, Zafra", "Zafra", "Badajoz", 38.425884, -6.416482, False),
            ("Jerez de los Caballeros", "jerez-caballeros", "fortaleza", "Centro historico", "Jerez de los Caballeros", "Badajoz", 38.320852, -6.771622, True),
        ]
        created_points = []
        for name, slug, category, address, city, province, lat, lng, preview in stamp_points_data:
            secret = generate_stamp_secret()
            created_points.append(
                StampPoint(
                    route_id=route.id,
                    name=name,
                    slug=slug,
                    description_public=f"Avance de {name.lower()} para inspirar la ruta.",
                    description_private=f"Consejos, parking y parada oficial para {name.lower()}.",
                    category=category,
                    address=address,
                    city=city,
                    province=province,
                    lat=lat,
                    lng=lng,
                    is_active=True,
                    is_public_preview=preview,
                    qr_public_code=f"{route.slug}-{slug}-{secret[:8]}".upper(),
                    qr_secret_hash=hash_value(secret),
                )
            )
        db.add_all(created_points)
        db.flush()

        order = Order(
            buyer_user_id=user.id,
            buyer_email=user.email,
            buyer_name=user.full_name,
            buyer_phone=user.phone,
            status="paid",
            total_cents=3085,
            currency="EUR",
        )
        db.add(order)
        db.flush()
        db.add_all(
            [
                OrderItem(order_id=order.id, route_id=route.id, passport_type_id=passport_types[0].id, quantity=1, unit_price_cents=1095, total_cents=1095),
                OrderItem(order_id=order.id, route_id=route.id, passport_type_id=passport_types[2].id, quantity=1, unit_price_cents=1690, total_cents=1690),
            ]
        )
        db.add(
            Payment(
                order_id=order.id,
                provider="mock",
                method="card",
                provider_payment_id="mock_seed_paid",
                amount_cents=3085,
                currency="EUR",
                status="paid",
                raw_response_json='{"provider":"mock","outcome":"success"}',
            )
        )
        inactive_passport = Passport(
            route_id=route.id,
            passport_type_id=passport_types[0].id,
            order_id=order.id,
            serial_number=generate_serial("ESP"),
            activation_code="DEMO-ACT-001",
            operational_status="inactive",
            stamp_status="unstamped",
        )
        active_passport = Passport(
            route_id=route.id,
            passport_type_id=passport_types[2].id,
            order_id=order.id,
            activated_by_user_id=user.id,
            serial_number=generate_serial("ESP"),
            activation_code="DEMO-ACT-002",
            owner_display_name="Viajera Demo",
            start_date=date.today(),
            operational_status="active",
            stamp_status="partially_stamped",
            activated_at=datetime.now(UTC).replace(tzinfo=None),
        )
        db.add_all([inactive_passport, active_passport])
        db.flush()
        db.add(
            Stamp(
                passport_id=active_passport.id,
                stamp_point_id=created_points[0].id,
                user_id=user.id,
                validation_status="valid",
                scan_source="admin_manual",
            )
        )
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
