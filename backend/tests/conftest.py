import pytest
from app import create_app
from app.extensions import db
from app.models.user import User, UserRole

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def admin_user(app):
    user = User(name='Admin', email='admin@example.com', password_hash='hashed', role=UserRole.ADMIN)
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture
def manager_user(app):
    user = User(name='Manager', email='manager@example.com', password_hash='hashed', role=UserRole.MANAGER)
    db.session.add(user)
    db.session.commit()
    return user