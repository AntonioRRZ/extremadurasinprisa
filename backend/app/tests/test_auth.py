def test_register_and_login(client):
    register = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new@example.com",
            "password": "Strong123!",
            "full_name": "Nueva Persona",
            "phone": "+34 611 111 111",
        },
    )
    assert register.status_code == 200
    assert register.json()["user"]["email"] == "new@example.com"

    login = client.post("/api/v1/auth/login", json={"email": "new@example.com", "password": "Strong123!"})
    assert login.status_code == 200
    assert "access_token" in login.json()

