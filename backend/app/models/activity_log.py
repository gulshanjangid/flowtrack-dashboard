from app.extensions import db
from datetime import datetime

class TaskActivityLogs(db.Model):
    __tablename__ = 'task_activity_logs'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    action = db.Column(db.String(200), nullable=False)  # e.g., 'Created', 'Updated', 'Status Changed'
    performed_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    task = db.relationship('Task', back_populates='activity_logs')
    performed_by_user = db.relationship('User', back_populates='performed_logs')

    __table_args__ = (
        db.Index('idx_activity_log_task_id', 'task_id'),
        db.Index('idx_activity_log_performed_by', 'performed_by'),
        db.Index('idx_activity_log_timestamp', 'timestamp'),
    )