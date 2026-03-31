from flask import Blueprint, request, jsonify
from app.services.team import TeamService
from app.utils.auth import role_required
from flask_jwt_extended import get_jwt_identity

teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/', methods=['POST'])
@role_required(['Admin', 'Manager'])
def create_team():
    try:
        data = request.get_json()
        creator_id = get_jwt_identity()
        team = TeamService.create_team(data, creator_id)
        return jsonify(team), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@teams_bp.route('/', methods=['GET'])
@role_required(['Admin', 'Manager', 'Member'])
def get_teams():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    teams, total = TeamService.get_teams(page=page, per_page=limit)
    return jsonify({'teams': teams, 'total': total, 'page': page, 'limit': limit})

@teams_bp.route('/<int:team_id>/members', methods=['POST'])
@role_required(['Admin', 'Manager'])
def add_team_member(team_id):
    try:
        data = request.get_json()
        data['team_id'] = team_id
        member = TeamService.add_team_member(data)
        return jsonify(member), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400