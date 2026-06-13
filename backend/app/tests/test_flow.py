def _headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_mock_purchase_activation_and_stamp_flow(client, user_token, admin_token):
    passport_types = client.get("/api/v1/routes/dehesas-y-ciudades-lentas/passport-types").json()
    order_response = client.post(
        "/api/v1/orders",
        headers=_headers(user_token),
        json={
            "buyer_email": "user@example.com",
            "buyer_name": "Viajera Demo",
            "buyer_phone": "+34 600 000 002",
            "items": [{"passport_type_id": passport_types[0]["id"], "quantity": 1}],
        },
    )
    assert order_response.status_code == 200
    order_id = order_response.json()["order"]["id"]

    checkout = client.post("/api/v1/payments/checkout-session", json={"order_id": order_id, "method": "bizum"})
    assert checkout.status_code == 200
    payment_id = checkout.json()["payment"]["id"]

    confirm = client.post("/api/v1/payments/mock/confirm", json={"payment_id": payment_id, "outcome": "success"})
    assert confirm.status_code == 200
    assert confirm.json()["order"]["status"] == "paid"

    passports_before = client.get("/api/v1/me/passports", headers=_headers(user_token))
    assert passports_before.status_code == 200

    activation = client.post(
        "/api/v1/me/passports/activate",
        headers=_headers(user_token),
        json={"activation_code": "DEMO-ACT-001", "owner_display_name": "Propietaria"},
    )
    assert activation.status_code == 200
    passport_id = activation.json()["id"]

    stamp_points = client.get("/api/v1/admin/routes/1/stamp-points", headers=_headers(admin_token)).json()["stamp_points"]
    regenerate = client.post(
        f"/api/v1/admin/stamp-points/{stamp_points[0]['id']}/regenerate-qr",
        headers=_headers(admin_token),
    )
    qr_value = regenerate.json()["qr_value"]

    scan = client.post(
        f"/api/v1/me/passports/{passport_id}/scan",
        headers=_headers(user_token),
        json={"qr_code": qr_value},
    )
    assert scan.status_code == 200
    assert scan.json()["status"] == "success"

    duplicate = client.post(
        f"/api/v1/me/passports/{passport_id}/scan",
        headers=_headers(user_token),
        json={"qr_code": qr_value},
    )
    assert duplicate.status_code == 200
    assert duplicate.json()["status"] == "duplicate"
