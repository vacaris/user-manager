from flask import Blueprint, request, jsonify
from app import db
from app.models import User

user_bp = Blueprint("user_bp", __name__)

# 🔹 Rregistration
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ["username", "email", "password"]):
        return jsonify({"error": "Brak wymaganych pól"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email już istnieje"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        password=data["password"],  # 🔴 Tu dodamy hashowanie w kolejnych krokach!
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Użytkownik zarejestrowany!"}), 201

# 🔹 getting the users
@user_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "username": u.username, "email": u.email} for u in users])

# 🔹 getting specific user
@user_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Użytkownik nie znaleziony"}), 404
    return jsonify({"id": user.id, "username": user.username, "email": user.email})
