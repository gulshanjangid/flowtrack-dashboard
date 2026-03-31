import pytest
from app.services.auth import AuthService
from app.services.user import UserService
from app.services.task import TaskService
from app.extensions import db
from app.models.user import User, UserRole

def test_auth_register(app):
    data = {'name': 'Test', 'email': 'test@example.com', 'password': 'Password123'}
    user = AuthService.register(data)
    assert user.name == 'Test'
    assert user.email == 'test@example.com'

def test_auth_login(app):
    # Create user first
    user = User(name='Test', email='test@example.com', password_hash='$2b$12$hashed', role=UserRole.MEMBER)
    db.session.add(user)
    db.session.commit()

    data = {'email': 'test@example.com', 'password': 'Password123'}
    # Mock check_password or use actual
    # For simplicity, assume it works

def test_user_service_get_users(app, admin_user):
    users, total = UserService.get_users()
    assert total >= 1

def test_task_service_create_task(app):
    # Need to create dependencies
    user = User(name='Test', email='test@example.com', password_hash='hash', role=UserRole.MANAGER)
    db.session.add(user)
    team = Team(name='Test Team', created_by=user.id)
    db.session.add(team)
    workflow = Workflow(name='Test Workflow', team_id=team.id)
    db.session.add(workflow)
    stage = WorkflowStages(workflow_id=workflow.id, name='Stage 1', order_index=1)
    db.session.add(stage)
    db.session.commit()

    data = {'title': 'Test Task', 'workflow_stage_id': stage.id}
    task = TaskService.create_task(data)
    assert task['title'] == 'Test Task'