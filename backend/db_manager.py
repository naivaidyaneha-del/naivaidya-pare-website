from db_mysql import MySQLManager
from db_mongodb import MongoDBManager

class DatabaseManager:
    def __init__(self):
        self.mysql = MySQLManager()
        self.mongo = MongoDBManager()

    def get_status(self):
        return {
            "mysql": "Connected" if self.mysql.is_connected else "Offline (Using SQLite Fallback)",
            "mongo": "Connected" if self.mongo.is_connected else "Offline (Using JSON Fallback)"
        }

    def save_registration(self, name, email, phone, message):
        saved_sources = []
        
        # Save to MySQL / Relational
        ok_m, src_m = self.mysql.save_registration(name, email, phone, message)
        if ok_m:
            saved_sources.append(src_m)

        # Save to MongoDB / NoSQL
        ok_mg, src_mg = self.mongo.save_registration(name, email, phone, message)
        if ok_mg:
            saved_sources.append(src_mg)

        return True, ", ".join(saved_sources)

    def get_all_registrations(self):
        # Fetch from MySQL/Relational
        relational_data = self.mysql.get_registrations()
        if relational_data:
            return relational_data
        
        # If empty, check Mongo
        mongo_data = self.mongo.get_registrations()
        return mongo_data
