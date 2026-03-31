import pytest
from app.models.user import User, UserRole
from app.models.team import Team, TeamMembers
from app.models.workflow import Workflow, WorkflowStages
from app.models.task import Task, TaskPriority
from app.models.activity_log import TaskActivityLogs

def test_user_model(app):
    user = User(name='Test', email='test@example.com', password_hash='hash', role=UserRole.MEMBER)
    assert user.name == 'Test'
    assert user.role == UserRole.MEMBER

def test_team_model(app):
    team = Team(name='Test Team', created_by=1)
    assert team.name == 'Test Team'

def test_workflow_model(app):
    workflow = Workflow(name='Test Workflow', team_id=1)
    assert workflow.name == 'Test Workflow'

def test_task_model(app):
    task = Task(title='Test Task', workflow_stage_id=1, priority=TaskPriority.MEDIUM)
    assert task.title == 'Test Task'
    assert task.priority == TaskPriority.MEDIUM

def test_activity_log_model(app):
    log = TaskActivityLogs(task_id=1, action='Created', performed_by=1)
    assert log.action == 'Created'