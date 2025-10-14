def test_tenant_config_loaded(client):
    response = client.get("/api/v1/admin/tenants")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "tenants" in data
    assert isinstance(data["tenants"], list)
    assert len(data["tenants"]) > 0


def test_rule_upload_and_list(client, auth_headers):
    # Simulate uploading a rules file (use a small dummy file)
    import io
    file_content = b"RULE_CODE,RULE_NAME\nTECH-TEST-001,Test Rule"
    response = client.post(
        "/api/v1/rules/upload?type=technical",
        files={"file": ("dummy_rules.csv", file_content, "text/csv")},
        headers=auth_headers
    )
    assert response.status_code == 200
    # Now list rules
    response = client.get("/api/v1/rules")
    assert response.status_code == 200
    data = response.json()
    assert "rules" in data
    assert isinstance(data["rules"], list)
    assert any("description" in rule for rule in data["rules"])
