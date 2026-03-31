from marshmallow import Schema, fields

class TeamSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    created_by = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class TeamMemberSchema(Schema):
    id = fields.Int(dump_only=True)
    team_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    role = fields.Str(required=True)