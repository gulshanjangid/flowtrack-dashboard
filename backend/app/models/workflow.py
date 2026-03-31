from app.extensions import db
from datetime import datetime

class Workflow(db.Model):
    __tablename__ = 'workflows'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    team = db.relationship('Team', back_populates='workflows')
    stages = db.relationship('WorkflowStages', back_populates='workflow', cascade='all, delete-orphan', order_by='WorkflowStages.order_index')

    __table_args__ = (
        db.Index('idx_workflow_team_id', 'team_id'),
    )

class WorkflowStages(db.Model):
    __tablename__ = 'workflow_stages'

    id = db.Column(db.Integer, primary_key=True)
    workflow_id = db.Column(db.Integer, db.ForeignKey('workflows.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    order_index = db.Column(db.Integer, nullable=False)

    # Relationships
    workflow = db.relationship('Workflow', back_populates='stages')
    tasks = db.relationship('Task', back_populates='stage')

    __table_args__ = (
        db.Index('idx_workflow_stages_workflow_id', 'workflow_id'),
        db.Index('idx_workflow_stages_order', 'workflow_id', 'order_index'),
    )