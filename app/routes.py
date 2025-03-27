from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/register", methods=["POST"])
@jwt_required()
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ["username", "email", "password"]):
        return jsonify({"error": "Brak wymaganych pól"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email już istnieje"}), 400

    current_user = User.query.get(get_jwt_identity())
    role = data.get("role", "user")

    if role != "user" and current_user.role != "admin":
        return jsonify({"error": "Tylko administrator może ustawiać rolę"}), 403

    new_user = User(username=data["username"], email=data["email"], role=role)
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Użytkownik zarejestrowany!"}), 201

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Brak wymaganych pól"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Nieprawidłowe dane"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token}), 200


@user_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != "admin":
        return jsonify([{
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role
        }])

    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role
        } for u in users
    ])

@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != "admin":
        return jsonify({"error": "Brak uprawnień"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Użytkownik nie znaleziony"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Użytkownik {user.username} usunięty."}), 200


@user_bp.route("/user/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != "admin" and current_user.id != user_id:
        return jsonify({"error": "Brak uprawnień"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Użytkownik nie znaleziony"}), 404

    data = request.get_json()
    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    if "role" in data and current_user.role == "admin":  # tylko admin może zmienić rolę
        user.role = data["role"]
    if "password" in data and data["password"]:
        user.set_password(data["password"])

    db.session.commit()
    return jsonify({"message": "Użytkownik zaktualizowany."}), 200

