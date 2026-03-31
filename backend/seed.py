from app import create_app
from app.extensions import db
from app.models.user import User, UserRole
from app.models.team import Team, TeamMembers
from app.models.workflow import Workflow, WorkflowStages
from app.models.task import Task, TaskPriority
from app.utils.auth import hash_password

app = create_app()

with app.app_context():
    # Clear existing data
    db.session.query(Task).delete()
    db.session.query(WorkflowStages).delete()
    db.session.query(Workflow).delete()
    db.session.query(TeamMembers).delete()
    db.session.query(Team).delete()
    db.session.query(User).delete()
    db.session.commit()

    # Create admin user
    admin = User(
        name='Admin User',
        email='admin@flowtrack.io',
        password_hash=hash_password('admin123'),
        role=UserRole.ADMIN
    )
    db.session.add(admin)
    db.session.commit()

    # Create team
    team = Team(name='Default Team', created_by=admin.id)
    db.session.add(team)
    db.session.commit()

    # Add admin to team
    member = TeamMembers(team_id=team.id, user_id=admin.id, role='Leader')
    db.session.add(member)
    db.session.commit()

    # Create workflow
    workflow = Workflow(name='Default Workflow', team_id=team.id)
    db.session.add(workflow)
    db.session.commit()

    # Create stages
    stage1 = WorkflowStages(workflow_id=workflow.id, name='To Do', order_index=1)
    stage2 = WorkflowStages(workflow_id=workflow.id, name='In Progress', order_index=2)
    stage3 = WorkflowStages(workflow_id=workflow.id, name='Done', order_index=3)
    db.session.add_all([stage1, stage2, stage3])
    db.session.commit()

    # Create sample tasks
    task1 = Task(
        title='Sample Task 1',
        description='This is a sample task',
        user_id=admin.id,
        workflow_stage_id=stage1.id,
        priority=TaskPriority.MEDIUM
    )
    task2 = Task(
        title='Sample Task 2',
        description='Another sample task',
        user_id=admin.id,
        workflow_stage_id=stage2.id,
        priority=TaskPriority.HIGH
    )
    db.session.add_all([task1, task2])
    db.session.commit()

    print("Seeded database with sample data")