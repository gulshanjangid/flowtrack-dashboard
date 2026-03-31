from app.extensions import db
from datetime import datetime
from enum import Enum

class TaskPriority(Enum):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'
    URGENT = 'Urgent'

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    workflow_stage_id = db.Column(db.Integer, db.ForeignKey('workflow_stages.id'), nullable=False)
    priority = db.Column(db.Enum(TaskPriority), nullable=False, default=TaskPriority.MEDIUM)
    deadline = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id])
    assigned_user = db.relationship('User', back_populates='assigned_tasks', foreign_keys=[assigned_to])
    stage = db.relationship('WorkflowStages', back_populates='tasks')
    activity_logs = db.relationship('TaskActivityLogs', back_populates='task', cascade='all, delete-orphan')

    __table_args__ = (
        db.Index('idx_task_user_id', 'user_id'),
        db.Index('idx_task_assigned_to', 'assigned_to'),
        db.Index('idx_task_workflow_stage_id', 'workflow_stage_id'),
        db.Index('idx_task_priority', 'priority'),
        db.Index('idx_task_deadline', 'deadline'),
    )