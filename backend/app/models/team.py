from app.extensions import db
from datetime import datetime

class Team(db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by])
    members = db.relationship('TeamMembers', back_populates='team', cascade='all, delete-orphan')
    workflows = db.relationship('Workflow', back_populates='team', cascade='all, delete-orphan')

    __table_args__ = (
        db.Index('idx_team_created_by', 'created_by'),
    )

class TeamMembers(db.Model):
    __tablename__ = 'team_members'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # e.g., 'Leader', 'Member'

    # Relationships
    team = db.relationship('Team', back_populates='members')
    user = db.relationship('User', back_populates='teams')

    __table_args__ = (
        db.UniqueConstraint('team_id', 'user_id', name='unique_team_user'),
        db.Index('idx_team_members_team_id', 'team_id'),
        db.Index('idx_team_members_user_id', 'user_id'),
    )