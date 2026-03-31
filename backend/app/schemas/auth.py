from marshmallow import Schema, fields, validates, ValidationError
import re

class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=lambda x: len(x) > 0)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 8)
    role = fields.Str(required=False, default='Member')

    @validates('password')
    def validate_password(self, value):
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$', value):
            raise ValidationError('Password must contain at least one lowercase letter, one uppercase letter, and one digit.')

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)