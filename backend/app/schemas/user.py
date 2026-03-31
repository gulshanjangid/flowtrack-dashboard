from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(dump_only=True)
    is_active = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class UserUpdateSchema(Schema):
    name = fields.Str()
    email = fields.Email()
    role = fields.Str()
    is_active = fields.Bool()