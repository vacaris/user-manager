import sqlite3



conn = sqlite3.connect("users.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tabele w bazie danych:", tables)

cursor.execute("PRAGMA table_info(user);")
columns = cursor.fetchall()

print("Kolumny w tabeli `user`:")
for column in columns:
    print(column)

conn.close()
