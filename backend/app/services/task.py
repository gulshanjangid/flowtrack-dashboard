from app.extensions import db
from app.models.task import Task, TaskPriority
from app.models.activity_log import TaskActivityLogs
from app.schemas.task import TaskSchema, TaskUpdateSchema
from marshmallow import ValidationError
from flask_jwt_extended import get_jwt_identity

class TaskService:
    @staticmethod
    def create_task(data, user_id):
        schema = TaskSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        validated_data['user_id'] = user_id
        task = Task(**validated_data)
        db.session.add(task)
        db.session.commit()

        # Log activity
        TaskService.log_activity(task.id, 'Created', user_id)

        return TaskSchema().dump(task)

    @staticmethod
    def get_tasks(user_id, page=1, per_page=10, filters=None):
        query = Task.query.filter_by(user_id=user_id)
        if filters:
            if 'status' in filters:
                # Assuming status is based on stage, but for simplicity
                pass
            if 'priority' in filters:
                query = query.filter_by(priority=TaskPriority(filters['priority']))
            if 'assigned_to' in filters:
                query = query.filter_by(assigned_to=filters['assigned_to'])
            if 'deadline' in filters:
                query = query.filter(Task.deadline <= filters['deadline'])

        tasks = query.paginate(page=page, per_page=per_page)
        schema = TaskSchema(many=True)
        return schema.dump(tasks.items), tasks.total

    @staticmethod
    def get_task(task_id, user_id):
        task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
        schema = TaskSchema()
        return schema.dump(task)

    @staticmethod
    def update_task(task_id, data, user_id):
        schema = TaskUpdateSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
        for key, value in validated_data.items():
            setattr(task, key, value)
        db.session.commit()

        # Log activity
        TaskService.log_activity(task_id, 'Updated', user_id)

        return TaskService.get_task(task_id, user_id)

    @staticmethod
    def delete_task(task_id, user_id):
        task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
        db.session.delete(task)
        db.session.commit()

    @staticmethod
    def get_task_logs(task_id, page=1, per_page=10):
        logs = TaskActivityLogs.query.filter_by(task_id=task_id).paginate(page=page, per_page=per_page)
        return [{'id': l.id, 'action': l.action, 'performed_by': l.performed_by, 'timestamp': l.timestamp.isoformat()} for l in logs.items], logs.total

    @staticmethod
    def log_activity(task_id, action, performed_by):
        log = TaskActivityLogs(task_id=task_id, action=action, performed_by=performed_by)
        db.session.add(log)
        db.session.commit()