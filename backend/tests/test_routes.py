import pytest
import json
from flask_jwt_extended import create_access_token

def test_register(client):
    data = {'name': 'Test', 'email': 'test@example.com', 'password': 'Password123'}
    response = client.post('/auth/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201

def test_login(client):
    # Register first
    data = {'name': 'Test', 'email': 'test@example.com', 'password': 'Password123'}
    client.post('/auth/register', data=json.dumps(data), content_type='application/json')

    login_data = {'email': 'test@example.com', 'password': 'Password123'}
    response = client.post('/auth/login', data=json.dumps(login_data), content_type='application/json')
    assert response.status_code == 200
    assert 'access_token' in response.get_json()

def test_get_users_unauthorized(client):
    response = client.get('/users/')
    assert response.status_code == 401

def test_get_users_authorized(client, admin_user):
    with client.application.app_context():
        token = create_access_token(identity=admin_user.id)
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/users/', headers=headers)
    assert response.status_code == 200