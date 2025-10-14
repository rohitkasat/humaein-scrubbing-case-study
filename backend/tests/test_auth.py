def test_login_success(client):
    response = client.post("/api/v1/auth/login", json={"email": "admin@humaein.local", "password": "Admin@123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure(client):
    response = client.post("/api/v1/auth/login", json={"email": "wrong@email.com", "password": "wrong"})
    assert response.status_code == 401

def test_auth_me(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@humaein.local"
    assert data["admin"] is True