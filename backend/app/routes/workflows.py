from flask import Blueprint, request, jsonify
from app.services.workflow import WorkflowService
from app.utils.auth import role_required

workflows_bp = Blueprint('workflows', __name__)

@workflows_bp.route('/', methods=['POST'])
@role_required(['Admin', 'Manager'])
def create_workflow():
    try:
        data = request.get_json()
        workflow = WorkflowService.create_workflow(data)
        return jsonify(workflow), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@workflows_bp.route('/', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_workflows():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    workflows, total = WorkflowService.get_workflows(page=page, per_page=limit)
    return jsonify({'workflows': workflows, 'total': total, 'page': page, 'limit': limit})

@workflows_bp.route('/<int:workflow_id>/stages', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_workflow_stages(workflow_id):
    stages = WorkflowService.get_workflow_stages(workflow_id)
    return jsonify({'stages': stages})