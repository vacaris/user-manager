from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask import Blueprint, request, jsonify
from app import db
from app.models import User

user_bp = Blueprint("user_bp", __name__)

# 🔹 register with hash
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ["username", "email", "password"]):
        return jsonify({"error": "Brak wymaganych pól"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email już istnieje"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"]
    )
    new_user.set_password(data["password"])  # Hashujemy hasło!

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Użytkownik zarejestrowany!"}), 201

# 🔹 login with JWT
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Brak wymaganych pól"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Nieprawidłowe dane"}), 401

    # Tworzymy token JWT
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "message": "Zalogowano pomyślnie"}), 200

# 🔹 getting users with JWT
@user_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()  # Pobieramy ID użytkownika z tokena JWT
    users = User.query.all()
    return jsonify([{"id": u.id, "username": u.username, "email": u.email} for u in users])

# 🔹 getting specific user with JWT
@user_bp.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Użytkownik nie znaleziony"}), 404
    return jsonify({"id": user.id, "username": user.username, "email": user.email})

# deleting a user
@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Użytkownik nie znaleziony"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Użytkownik {user.username} został usunięty."}), 200

#editing a user
@user_bp.route("/user/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Użytkownik nie znaleziony"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Brak danych do edycji"}), 400

    # Możemy zmienić tylko username i email
    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]

    db.session.commit()
    return jsonify({"message": f"Użytkownik {user.username} został zaktualizowany."}), 200


