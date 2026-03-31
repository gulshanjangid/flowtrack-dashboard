from app.extensions import db
from app.models.user import User, UserRole
from app.utils.auth import hash_password, check_password, generate_tokens
from app.schemas.auth import RegisterSchema, LoginSchema
from marshmallow import ValidationError
from flask import current_app
import logging

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    def register(data):
        schema = RegisterSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        if User.query.filter_by(email=validated_data['email']).first():
            raise ValueError('Email already exists')

        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            password_hash=hash_password(validated_data['password']),
            role=UserRole(validated_data.get('role', 'Member'))
        )
        db.session.add(user)
        db.session.commit()

        logger.info(f'User registered: {user.email}')
        return user

    @staticmethod
    def login(data):
        schema = LoginSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        user = User.query.filter_by(email=validated_data['email']).first()
        if not user or not check_password(validated_data['password'], user.password_hash):
            logger.warning(f'Failed login attempt for email: {validated_data["email"]}')
            raise ValueError('Invalid credentials')

        access_token, refresh_token = generate_tokens(user.id)
        logger.info(f'User logged in: {user.email}')
        return {'access_token': access_token, 'refresh_token': refresh_token}