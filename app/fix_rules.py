from app import db
from app.models import User
from app.main import create_app

app = create_app()
with app.app_context():
    users = User.query.all()
    for user in users:
        if not user.role:
            user.role = "user"
    db.session.commit()
    print("Poprawiono role dla istniejących użytkowników!")
