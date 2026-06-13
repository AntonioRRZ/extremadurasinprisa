def test_public_register_is_disabled(client):
    register = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new@example.com",
            "password": "Strong123!",
            "full_name": "Nueva Persona",
            "phone": "+34 611 111 111",
        },
    )
    assert register.status_code == 403
    assert "activation code" in register.json()["detail"].lower()


def test_activation_register_and_login(client):
    register = client.post(
        "/api/v1/auth/activation/register",
        json={
            "activation_code": "DEMO-ACT-001",
            "email": "new@example.com",
            "password": "Strong123!",
            "full_name": "Nueva Persona",
            "phone": "+34 611 111 111",
            "owner_display_name": "Nueva Persona",
        },
    )
    assert register.status_code == 200
    assert register.json()["user"]["email"] == "new@example.com"

    login = client.post("/api/v1/auth/login", json={"email": "new@example.com", "password": "Strong123!"})
    assert login.status_code == 200
    assert "access_token" in login.json()

    passports = client.get("/api/v1/me/passports", headers={"Authorization": f"Bearer {login.json()['access_token']}"})
    assert passports.status_code == 200
    assert passports.json()[0]["operational_status"] == "active"
