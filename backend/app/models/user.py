from app.extensions import db
from datetime import datetime
from enum import Enum

class UserRole(Enum):
    ADMIN = 'Admin'
    MANAGER = 'Manager'
    MEMBER = 'Member'

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.MEMBER)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    teams = db.relationship('TeamMembers', back_populates='user', cascade='all, delete-orphan')
    assigned_tasks = db.relationship('Task', back_populates='assigned_user', foreign_keys='Task.assigned_to')
    created_tasks = db.relationship('Task', back_populates='user', foreign_keys='Task.user_id')
    performed_logs = db.relationship('TaskActivityLogs', back_populates='performed_by_user')

    __table_args__ = (
        db.Index('idx_user_email', 'email'),
    )