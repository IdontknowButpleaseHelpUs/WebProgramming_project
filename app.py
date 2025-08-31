from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import uuid

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

COURSES_FILE = "database/courses.json"
USERS_FILE = "database/users.json"
ADMINS_FILE = "database/admins.json"
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def load_json(filename):
   if os.path.exists(filename):
      with open(filename, "r") as file:
            return json.load(file)
   return {}


def save_json(filename, data):
   with open(filename, "w") as file:
      json.dump(data, file, indent=4)


def allowed_file(filename):
   return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
   return render_template("page1.html")


@app.route("/admin")
def admin_panel():
   return render_template("page1.html")

@app.route("/api/courses", methods=["GET"])
def get_courses():
   courses = load_json(COURSES_FILE)
   return jsonify(courses)

@app.route("/api/users", methods=["GET"])
def get_users():
   users = load_json(USERS_FILE)
   return jsonify(users)

@app.route("/api/admin-login", methods=["POST"])
def admin_login():
   data = request.json
   username = data.get("username")
   password = data.get("password")

   admins = load_json(ADMINS_FILE)

   for admin in admins.values():
      if admin["username"] == username and admin["password"] == password:
            return jsonify(
               {"success": True, "message": "Login successful", "username": username}
            )

   return jsonify({"success": False, "message": "Invalid username or password"})


@app.route("/api/admin/<username>", methods=["GET"])
def get_admin_profile(username):
   admins = load_json(ADMINS_FILE)
   if username in admins:
      return jsonify(admins[username])
   return jsonify({"error": "Admin not found"}), 404


@app.route("/api/admin/<username>", methods=["POST"])
def update_admin_profile(username):
   data = request.json
   admins = load_json(ADMINS_FILE)

   if username in admins:
      admins[username].update(data)
      save_json(ADMINS_FILE, admins)
      return jsonify({"success": True, "message": "Profile updated successfully"})

   return jsonify({"success": False, "message": "Admin not found"}), 404


@app.route("/api/upload-profile-pic/<username>", methods=["POST"])
def upload_profile_pic(username):
   if "profilePic" not in request.files:
      return jsonify({"success": False, "message": "No file part"}), 400

   file = request.files["profilePic"]
   if file.filename == "":
      return jsonify({"success": False, "message": "No selected file"}), 400

   if file and allowed_file(file.filename):
      ext = os.path.splitext(file.filename)[1].lower()
      unique_id = uuid.uuid4().hex[:8]
      filename = secure_filename(f"{username}_{unique_id}{ext}")
      file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
      file.save(file_path)

      # Update JSON
      admins = load_json(ADMINS_FILE)
      if username in admins:
            admins[username]["profilePic"] = f"/static/uploads/{filename}"
            save_json(ADMINS_FILE, admins)
            return jsonify(
               {
                  "success": True,
                  "message": "Profile picture uploaded",
                  "profilePic": f"/static/uploads/{filename}",
               }
            )
      else:
            return jsonify({"success": False, "message": "Account not found"}), 404

   return jsonify({"success": False, "message": "Invalid file type"}), 400


if __name__ == "__main__":
   app.run(debug=True)
