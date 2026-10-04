import datetime
import os
import json

class MongoDBManager:
    def __init__(self, uri="mongodb://localhost:27017/", database="naivaidya_db"):
        self.uri = uri
        self.database_name = database
        self.is_connected = False
        self.db = None
        self._init_connection()

    def _init_connection(self):
        try:
            from pymongo import MongoClient
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=200)
            # Trigger server connection check
            self.client.server_info()
            self.db = self.client[self.database_name]
            self.is_connected = True
            print("Successfully connected to MongoDB Database.")
        except Exception as e:
            print(f"MongoDB connection info: {e}. Using Mongo Document Fallback.")
            self.is_connected = False
            self.fallback_file = os.path.join(os.path.dirname(__file__), "fallback_mongo.json")

    def save_registration(self, name, email, phone, message):
        doc = {
            "name": name,
            "email": email,
            "phone": phone,
            "message": message,
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        if self.is_connected and self.db is not None:
            try:
                self.db.registrations.insert_one(doc)
                return True, "MongoDB"
            except Exception as e:
                print("MongoDB insert error:", e)

        # JSON Document fallback
        items = []
        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r") as f:
                    items = json.load(f)
            except Exception:
                items = []
        items.insert(0, doc)
        with open(self.fallback_file, "w") as f:
            json.dump(items, f, indent=2)
        return True, "Mongo Document Fallback"

    def get_registrations(self):
        if self.is_connected and self.db is not None:
            try:
                docs = list(self.db.registrations.find({}, {"_id": 0}).sort("_id", -1))
                for d in docs:
                    d["source_db"] = "MongoDB NoSQL"
                return docs
            except Exception as e:
                print("MongoDB fetch error:", e)

        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r") as f:
                    docs = json.load(f)
                    for d in docs:
                        d["source_db"] = "Mongo Document File DB"
                    return docs
            except Exception:
                return []
        return []
