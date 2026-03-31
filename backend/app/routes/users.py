from flask import Blueprint, request, jsonify
from app.services.user import UserService
from app.utils.auth import role_required
from app.models.user import User
from flask_jwt_extended import get_jwt_identity

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_current_user():
    user_id = int(get_jwt_identity())
    user = UserService.get_user(user_id)
    return jsonify(user)

@users_bp.route('/', methods=['GET'])
@role_required(['Admin'])
def get_users():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    users, total = UserService.get_users(page=page, per_page=limit)
    return jsonify({'users': users, 'total': total, 'page': page, 'limit': limit})

@users_bp.route('/<int:user_id>', methods=['GET'])
@role_required(['Admin', 'Manager'])
def get_user(user_id):
    user = UserService.get_user(user_id)
    return jsonify(user)

@users_bp.route('/<int:user_id>', methods=['PUT'])
@role_required(['Admin'])
def update_user(user_id):
    try:
        data = request.get_json()
        user = UserService.update_user(user_id, data)
        return jsonify(user)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@role_required(['Admin'])
def delete_user(user_id):
    UserService.delete_user(user_id)
    return jsonify({'message': 'User deleted'})