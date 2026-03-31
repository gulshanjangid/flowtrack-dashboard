from app.extensions import db
from app.models.team import Team, TeamMembers
from app.schemas.team import TeamSchema, TeamMemberSchema
from marshmallow import ValidationError

class TeamService:
    @staticmethod
    def create_team(data, creator_id):
        schema = TeamSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        team = Team(name=validated_data['name'], created_by=creator_id)
        db.session.add(team)
        db.session.commit()
        return TeamSchema().dump(team)

    @staticmethod
    def get_teams(page=1, per_page=10):
        teams = Team.query.paginate(page=page, per_page=per_page)
        schema = TeamSchema(many=True)
        return schema.dump(teams.items), teams.total

    @staticmethod
    def add_team_member(data):
        schema = TeamMemberSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(str(err))

        member = TeamMembers(**validated_data)
        db.session.add(member)
        db.session.commit()
        return TeamMemberSchema().dump(member)