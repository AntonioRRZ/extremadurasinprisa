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


def test_admin_users_list_is_enriched(client, admin_token):
    response = client.get("/api/v1/admin/users", headers=_headers(admin_token))
    assert response.status_code == 200
    users = response.json()["users"]
    assert users

    demo_user = next(user for user in users if user["email"] == "user@example.com")
    assert demo_user["passport_status"] == "active"
    assert demo_user["active_passports_count"] == 1
    assert demo_user["last_route_title"] == "Dehesas y ciudades lentas"
    assert demo_user["last_stamp_at"] is not None


def test_admin_user_detail_includes_passports_stamps_and_orders(client, admin_token):
    users_response = client.get("/api/v1/admin/users", headers=_headers(admin_token))
    assert users_response.status_code == 200
    user_id = next(user["id"] for user in users_response.json()["users"] if user["email"] == "user@example.com")

    detail_response = client.get(f"/api/v1/admin/users/{user_id}", headers=_headers(admin_token))
    assert detail_response.status_code == 200
    detail = detail_response.json()

    assert detail["user"]["email"] == "user@example.com"
    assert detail["passport_status"] == "active"
    assert detail["active_passports_count"] == 1
    assert detail["total_stamps"] == 1
    assert len(detail["orders"]) == 1
    assert len(detail["passport_details"]) == 1
    assert len(detail["passport_details"][0]["stamp_points"]) >= 1
    assert len(detail["passport_details"][0]["stamps"]) == 1


def test_admin_orders_include_fulfillment_fields(client, admin_token):
    response = client.get("/api/v1/admin/orders", headers=_headers(admin_token))
    assert response.status_code == 200
    order = response.json()["orders"][0]
    assert "fulfillment_status" in order
    assert "tracking_code" in order
    assert "admin_notes" in order


def test_admin_order_detail_and_update(client, admin_token):
    orders_response = client.get("/api/v1/admin/orders", headers=_headers(admin_token))
    assert orders_response.status_code == 200
    order_id = orders_response.json()["orders"][0]["id"]

    detail_response = client.get(f"/api/v1/admin/orders/{order_id}", headers=_headers(admin_token))
    assert detail_response.status_code == 200
    detail = detail_response.json()
    assert "payments" in detail
    assert "passports" in detail

    update_response = client.patch(
        f"/api/v1/admin/orders/{order_id}",
        headers=_headers(admin_token),
        json={
            "fulfillment_status": "shipped",
            "tracking_code": "ESP-TRACK-999",
            "admin_notes": "Preparado y entregado al operador logistico.",
        },
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["fulfillment_status"] == "shipped"
    assert updated["tracking_code"] == "ESP-TRACK-999"
    assert updated["admin_notes"] == "Preparado y entregado al operador logistico."
    assert updated["shipped_at"] is not None


def test_admin_creates_route_stamp_point_and_interest_point(client, admin_token):
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

    interest_payload = {
        "name": "Mirador del valle",
        "slug": "mirador-del-valle",
        "point_type": "mirador",
        "summary": "Parada escenica con buena lectura del paisaje.",
        "description": "Mirador recomendado para amanecer o ultima luz.",
        "address": "Carretera local s/n",
        "city": "Plasencia",
        "province": "Caceres",
        "lat": 39.98,
        "lng": -6.01,
        "website_url": "https://example.com/mirador",
        "contact_phone": "+34 600 000 999",
        "schedule_notes": "Acceso libre",
        "parking_notes": "Apartadero corto",
        "access_notes": "Ultimo tramo estrecho",
        "pet_friendly": True,
        "is_public_preview": True,
        "is_active": True,
        "sort_order": 1,
    }
    created_interest = client.post(
        f"/api/v1/admin/routes/{route_id}/interest-points",
        headers=_headers(admin_token),
        json=interest_payload,
    )
    assert created_interest.status_code == 200
    assert created_interest.json()["point_type"] == "mirador"

    listed_interest = client.get(f"/api/v1/admin/routes/{route_id}/interest-points", headers=_headers(admin_token))
    assert listed_interest.status_code == 200
    assert len(listed_interest.json()["interest_points"]) == 1


def test_public_route_preview_includes_interest_points(client):
    response = client.get("/api/v1/routes/dehesas-y-ciudades-lentas/interest-points/public")
    assert response.status_code == 200
    preview_points = response.json()
    assert preview_points
    assert "point_type" in preview_points[0]


def test_admin_updates_existing_stamp_and_interest_points(client, admin_token):
    updated_route = client.patch(
        "/api/v1/admin/routes/1",
        headers=_headers(admin_token),
        json={
            "title": "Dehesas y ciudades lentas revisada",
            "subtitle": "Nueva lectura editorial",
            "status": "draft",
            "public_teaser_enabled": False,
            "private_map_enabled": True,
            "min_stamps_to_complete": 5,
        },
    )
    assert updated_route.status_code == 200
    assert updated_route.json()["title"] == "Dehesas y ciudades lentas revisada"
    assert updated_route.json()["subtitle"] == "Nueva lectura editorial"
    assert updated_route.json()["status"] == "draft"
    assert updated_route.json()["public_teaser_enabled"] is False
    assert updated_route.json()["min_stamps_to_complete"] == 5

    stamp_points = client.get("/api/v1/admin/routes/1/stamp-points", headers=_headers(admin_token))
    assert stamp_points.status_code == 200
    stamp_point_id = stamp_points.json()["stamp_points"][0]["id"]

    updated_stamp = client.patch(
        f"/api/v1/admin/stamp-points/{stamp_point_id}",
        headers=_headers(admin_token),
        json={
            "name": "Plasencia monumental revisado",
            "category": "historia",
            "is_public_preview": False,
            "is_active": False,
        },
    )
    assert updated_stamp.status_code == 200
    assert updated_stamp.json()["name"] == "Plasencia monumental revisado"
    assert updated_stamp.json()["category"] == "historia"
    assert updated_stamp.json()["is_public_preview"] is False
    assert updated_stamp.json()["is_active"] is False

    interest_points = client.get("/api/v1/admin/routes/1/interest-points", headers=_headers(admin_token))
    assert interest_points.status_code == 200
    interest_point_id = interest_points.json()["interest_points"][0]["id"]

    updated_interest = client.patch(
        f"/api/v1/admin/interest-points/{interest_point_id}",
        headers=_headers(admin_token),
        json={
            "name": "Area camper revisada",
            "point_type": "servicio",
            "pet_friendly": False,
            "is_active": False,
        },
    )
    assert updated_interest.status_code == 200
    assert updated_interest.json()["name"] == "Area camper revisada"
    assert updated_interest.json()["point_type"] == "servicio"
    assert updated_interest.json()["pet_friendly"] is False
    assert updated_interest.json()["is_active"] is False
