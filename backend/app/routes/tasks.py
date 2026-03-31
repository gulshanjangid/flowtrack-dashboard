from flask import Blueprint, request, jsonify
from app.services.task import TaskService
from app.utils.auth import role_required
from flask_jwt_extended import get_jwt_identity

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['POST'])
@role_required(['Admin', 'Manager', 'Member'])
def create_task():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        task = TaskService.create_task(data, user_id)
        return jsonify(task), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@tasks_bp.route('/', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_tasks():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    filters = {}
    if 'priority' in request.args:
        filters['priority'] = request.args['priority']
    if 'assigned_to' in request.args:
        filters['assigned_to'] = int(request.args['assigned_to'])
    if 'deadline' in request.args:
        filters['deadline'] = request.args['deadline']
    tasks, total = TaskService.get_tasks(user_id, page=page, per_page=limit, filters=filters)
    return jsonify({'tasks': tasks, 'total': total, 'page': page, 'limit': limit})

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_task(task_id):
    user_id = get_jwt_identity()
    try:
        task = TaskService.get_task(task_id, user_id)
        return jsonify(task)
    except:
        return jsonify({'error': 'Task not found or access denied'}), 404

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@role_required(['Admin', 'Manager', 'Member'])
def update_task(task_id):
    user_id = get_jwt_identity()
    try:
        data = request.get_json()
        task = TaskService.update_task(task_id, data, user_id)
        return jsonify(task)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except:
        return jsonify({'error': 'Task not found or access denied'}), 404

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@role_required(['Admin', 'Manager', 'Member'])
def delete_task(task_id):
    user_id = get_jwt_identity()
    try:
        TaskService.delete_task(task_id, user_id)
        return jsonify({'message': 'Task deleted'})
    except:
        return jsonify({'error': 'Task not found or access denied'}), 404

@tasks_bp.route('/<int:task_id>/logs', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_task_logs(task_id):
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    logs, total = TaskService.get_task_logs(task_id, page=page, per_page=limit)
    return jsonify({'logs': logs, 'total': total, 'page': page, 'limit': limit})