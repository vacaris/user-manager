import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # path for database
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, '../users.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # configuring jwt
    app.config["JWT_SECRET_KEY"] = "super_secret_key"

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from app.models import User
        db.create_all()

    from app.routes import user_bp
    app.register_blueprint(user_bp)

    return app
