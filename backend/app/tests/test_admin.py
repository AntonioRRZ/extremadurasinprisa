def _headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_admin_permissions(client, user_token):
    response = client.get("/api/v1/admin/dashboard/summary", headers=_headers(user_token))
    assert response.status_code == 403


def test_admin_dashboard_summary_shape(client, admin_token):
    response = client.get("/api/v1/admin/dashboard/summary", headers=_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"users", "routes", "orders", "active_passports", "stamps"}
    assert data["orders"] >= 1


def test_admin_creates_route_and_stamp_point(client, admin_token):
    route_payload = {
        "slug": "ruta-nueva",
        "title": "Ruta Nueva",
        "subtitle": "Descripcion",
        "description_short": "corta",
        "description_long": "larga",
        "province_scope": "Caceres",
        "distance_km": 100,
        "estimated_days_min": 2,
        "estimated_days_max": 3,
        "hero_image_url": "https://example.com/img.jpg",
        "status": "published",
        "public_teaser_enabled": True,
        "private_map_enabled": True,
        "min_stamps_to_complete": 2,
    }
    created_route = client.post("/api/v1/admin/routes", headers=_headers(admin_token), json=route_payload)
    assert created_route.status_code == 200
    route_id = created_route.json()["id"]

    stamp_payload = {
        "name": "Punto Oficial",
        "slug": "punto-oficial",
        "description_public": "avance",
        "description_private": "detalle",
        "category": "patrimonio",
        "address": "Centro",
        "city": "Plasencia",
        "province": "Caceres",
        "lat": 40.0,
        "lng": -6.0,
        "is_active": True,
        "is_public_preview": True,
    }
    created_stamp = client.post(
        f"/api/v1/admin/routes/{route_id}/stamp-points",
        headers=_headers(admin_token),
        json=stamp_payload,
    )
    assert created_stamp.status_code == 200
    assert created_stamp.json()["qr_value"].startswith("ESPSTAMP|")
