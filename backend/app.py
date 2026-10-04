import os
from flask import Flask, request, jsonify, send_from_directory
from db_manager import DatabaseManager

frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app = Flask(__name__, static_folder=frontend_folder, static_url_path="")

# Enable CORS manually & Cache-Control for ultra-fast response speed
@app.after_request
def add_cors_and_cache_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    if request.path.startswith("/css") or request.path.startswith("/js"):
        response.headers["Cache-Control"] = "public, max-age=86400"
    return response

# Initialize Database Manager
db_manager = DatabaseManager()

# Pre-cached status for instant responses
HEALTH_CACHE = None
LAST_HEALTH_TIME = 0

# SERVE FRONTEND STATIC FILES
@app.route("/")
def serve_index():
    return send_from_directory(frontend_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    if os.path.exists(os.path.join(frontend_folder, path)):
        return send_from_directory(frontend_folder, path)
    return send_from_directory(frontend_folder, "index.html")

# API ENDPOINTS (Task 2 Ultra-Fast Optimization)
@app.route("/api/health", methods=["GET"])
def health_check():
    global HEALTH_CACHE, LAST_HEALTH_TIME
    import time
    now = time.time()
    if HEALTH_CACHE is None or (now - LAST_HEALTH_TIME) > 3:
        status = db_manager.get_status()
        HEALTH_CACHE = {
            "status": "online",
            "app": "Naivaidya Pare Portfolio Backend",
            "mysql_status": status["mysql"],
            "mongo_status": status["mongo"]
        }
        LAST_HEALTH_TIME = now
    return jsonify(HEALTH_CACHE)

@app.route("/api/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not phone:
        return jsonify({
            "success": False,
            "message": "Name, Email, and Phone number are required fields."
        }), 400

    success, saved_in = db_manager.save_registration(name, email, phone, message)
    
    if success:
        return jsonify({
            "success": True,
            "message": "Registration submitted successfully!",
            "saved_in": saved_in
        }), 201
    else:
        return jsonify({
            "success": False,
            "message": "Failed to save registration to database."
        }), 500

@app.route("/api/submissions", methods=["GET"])
def get_submissions():
    submissions = db_manager.get_all_registrations()
    return jsonify({
        "success": True,
        "count": len(submissions),
        "submissions": submissions
    })

@app.route("/api/skills", methods=["GET"])
def get_skills():
    skills = [
        {"name": "HTML", "icon": "https://cdn-icons-png.flaticon.com/512/732/732212.png", "category": "Frontend"},
        {"name": "CSS", "icon": "https://cdn-icons-png.flaticon.com/512/732/732190.png", "category": "Frontend"},
        {"name": "JavaScript", "icon": "https://cdn-icons-png.flaticon.com/512/5968/5968292.png", "category": "Frontend"},
        {"name": "Python", "icon": "https://cdn-icons-png.flaticon.com/512/5968/5968350.png", "category": "Backend"},
        {"name": "Java", "icon": "https://cdn-icons-png.flaticon.com/512/226/226777.png", "category": "Backend"},
        {"name": "PHP", "icon": "https://cdn-icons-png.flaticon.com/512/919/919828.png", "category": "Backend"},
        {"name": "MySQL", "icon": "https://cdn-icons-png.flaticon.com/512/919/919836.png", "category": "Database"},
        {"name": "MongoDB", "icon": "https://cdn-icons-png.flaticon.com/512/5968/5968313.png", "category": "Database"},
        {"name": "ReactJS", "icon": "https://cdn-icons-png.flaticon.com/512/919/919851.png", "category": "Frontend"},
        {"name": "NodeJS", "icon": "https://cdn-icons-png.flaticon.com/512/919/919825.png", "category": "Backend"}
    ]
    return jsonify({"success": True, "skills": skills})

if __name__ == "__main__":
    print("Starting Naivaidya Pare Web Backend Server on http://127.0.0.1:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
