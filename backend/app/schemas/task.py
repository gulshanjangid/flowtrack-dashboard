from marshmallow import Schema, fields

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str()
    user_id = fields.Int(dump_only=True)
    assigned_to = fields.Int()
    workflow_stage_id = fields.Int(required=True)
    priority = fields.Str()
    deadline = fields.DateTime()
    created_at = fields.DateTime(dump_only=True)

class TaskUpdateSchema(Schema):
    title = fields.Str()
    description = fields.Str()
    assigned_to = fields.Int()
    workflow_stage_id = fields.Int()
    priority = fields.Str()
    deadline = fields.DateTime()