from app import create_app, db
from app.models import User  # <- UPEWNIJ SIĘ, ŻE JEST!

app = create_app()

# creating tables in databases
with app.app_context():
    db.create_all()  # WAŻNE: To tworzy tabele w SQLite!

if __name__ == "__main__":
    app.run(debug=True)
