from app.extensions import db
from app.models.user import User
from app.schemas.user import UserSchema, UserUpdateSchema
from marshmallow import ValidationError

class UserService:
    @staticmethod
    def get_users(page=1, per_page=10):
        users = User.query.paginate(page=page, per_page=per_page)
        schema = UserSchema(many=True)
        return schema.dump(users.items), users.total

    @staticmethod
    def get_user(user_id):
        user = User.query.get_or_404(user_id)
        schema = UserSchema()
        return schema.dump(user)

    @staticmethod
    def update_user(user_id, data):
        schema = UserUpdateSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        user = User.query.get_or_404(user_id)
        for key, value in validated_data.items():
            setattr(user, key, value)
        db.session.commit()
        return UserService.get_user(user_id)

    @staticmethod
    def delete_user(user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()