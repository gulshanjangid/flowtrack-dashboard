from app.extensions import db
from app.models.workflow import Workflow, WorkflowStages
from app.schemas.workflow import WorkflowSchema, WorkflowStageSchema
from marshmallow import ValidationError

class WorkflowService:
    @staticmethod
    def create_workflow(data):
        schema = WorkflowSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        workflow = Workflow(**validated_data)
        db.session.add(workflow)
        db.session.commit()
        return WorkflowSchema().dump(workflow)

    @staticmethod
    def get_workflows(page=1, per_page=10):
        workflows = Workflow.query.paginate(page=page, per_page=per_page)
        schema = WorkflowSchema(many=True)
        return schema.dump(workflows.items), workflows.total

    @staticmethod
    def get_workflow_stages(workflow_id):
        stages = WorkflowStages.query.filter_by(workflow_id=workflow_id).order_by(WorkflowStages.order_index).all()
        schema = WorkflowStageSchema(many=True)
        return schema.dump(stages)