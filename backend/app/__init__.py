from flask import Flask
from app.config import Config
from app.extensions import db, jwt, migrate, cors
from app.utils.logging_config import setup_logging

def create_app():
    setup_logging()

    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.teams import teams_bp
    from app.routes.workflows import workflows_bp
    from app.routes.tasks import tasks_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(teams_bp, url_prefix='/teams')
    app.register_blueprint(workflows_bp, url_prefix='/workflows')
    app.register_blueprint(tasks_bp, url_prefix='/tasks')

    return app