from marshmallow import Schema, fields

class WorkflowSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    team_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)

class WorkflowStageSchema(Schema):
    id = fields.Int(dump_only=True)
    workflow_id = fields.Int(required=True)
    name = fields.Str(required=True)
    order_index = fields.Int(required=True)