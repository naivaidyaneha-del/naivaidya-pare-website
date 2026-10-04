import os
import sqlite3
import datetime

class MySQLManager:
    def __init__(self, host="localhost", user="root", password="", database="naivaidya_db"):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.is_connected = False
        self.conn = None
        self._init_connection()

    def _init_connection(self):
        try:
            import mysql.connector
            self.conn = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                connection_timeout=1
            )
            self.is_connected = True
            self._init_tables()
            print("Successfully connected to MySQL Database.")
        except Exception as e:
            print(f"MySQL connection info: {e}. Falling back to SQLite for local relational storage.")
            self.is_connected = False
            self._init_sqlite_fallback()

    def _init_tables(self):
        if not self.is_connected or not self.conn:
            return
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.conn.commit()

    def _init_sqlite_fallback(self):
        db_path = os.path.join(os.path.dirname(__file__), "fallback_relational.db")
        self.sqlite_conn = sqlite3.connect(db_path, check_same_thread=False)
        cursor = self.sqlite_conn.cursor()
        cursor.execute("PRAGMA journal_mode = WAL;")
        cursor.execute("PRAGMA synchronous = NORMAL;")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT,
                created_at TEXT
            )
        """)
        self.sqlite_conn.commit()

    def save_registration(self, name, email, phone, message):
        created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if self.is_connected and self.conn:
            try:
                cursor = self.conn.cursor()
                sql = "INSERT INTO registrations (name, email, phone, message, created_at) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(sql, (name, email, phone, message, created_at))
                self.conn.commit()
                return True, "MySQL"
            except Exception as e:
                print("MySQL insert error:", e)

        # Fallback SQLite
        cursor = self.sqlite_conn.cursor()
        cursor.execute(
            "INSERT INTO registrations (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)",
            (name, email, phone, message, created_at)
        )
        self.sqlite_conn.commit()
        return True, "SQLite Relational Fallback"

    def get_registrations(self):
        if self.is_connected and self.conn:
            try:
                cursor = self.conn.cursor(dictionary=True)
                cursor.execute("SELECT name, email, phone, message, created_at FROM registrations ORDER BY id DESC")
                results = cursor.fetchall()
                for r in results:
                    r["created_at"] = str(r["created_at"])
                    r["source_db"] = "MySQL Database"
                return results
            except Exception as e:
                print("MySQL fetch error:", e)

        cursor = self.sqlite_conn.cursor()
        cursor.execute("SELECT name, email, phone, message, created_at FROM registrations ORDER BY id DESC")
        rows = cursor.fetchall()
        return [
            {
                "name": row[0],
                "email": row[1],
                "phone": row[2],
                "message": row[3],
                "created_at": row[4],
                "source_db": "SQLite Relational DB"
            }
            for row in rows
        ]
