from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import uuid

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(
   app,
   resources={r"/api/*": {"origins": "*"}},
   allow_headers=["Content-Type"],
   supports_credentials=True,
)

COURSES_FILE = "database/courses.json"
STUDENTS_FILE = "database/students.json"
ADMINS_FILE = "database/admins.json"
LECTURERS_FILE = "database/lecturers.json"
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def load_json(filename):
   if os.path.exists(filename):
      with open(filename, "r", encoding="utf-8") as file:
            return json.load(file)
   return {}


def save_json(filename, data):
   with open(filename, "w", encoding="utf-8") as file:
      json.dump(data, file, indent=4, ensure_ascii=False)


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
   return jsonify(list(courses.values()))


@app.route("/api/courses", methods=["POST"])
def add_course():
   new_course = request.json
   courses = load_json(COURSES_FILE)
   new_id = f"course{len(courses) + 1}"
   courses[new_id] = new_course
   save_json(COURSES_FILE, courses)
   return jsonify({"success": True, "course": new_course}), 201


@app.route("/api/courses/<courseid>", methods=["PUT"])
def update_course(courseid):
   data = request.json
   courses = load_json(COURSES_FILE)
   for cid, course in courses.items():
      if course.get("courseid") == courseid:
            courses[cid].update(data)
            save_json(COURSES_FILE, courses)
            return jsonify({"success": True, "course": courses[cid]})
   return jsonify({"success": False, "message": "Course not found"}), 404


@app.route("/api/courses/<courseid>", methods=["DELETE"])
def delete_course(courseid):
   courses = load_json(COURSES_FILE)
   for cid, course in list(courses.items()):
      if course.get("courseid") == courseid:
            deleted = courses.pop(cid)
            save_json(COURSES_FILE, courses)
            return jsonify({"success": True, "deleted": deleted})
   return jsonify({"success": False, "message": "Course not found"}), 404


@app.route("/api/users", methods=["GET"])
def get_users():
   users = load_json(STUDENTS_FILE)
   return jsonify(users)


@app.route("/api/login", methods=["GET", "POST"])
def login():
   data = request.json
   username = data.get("username")
   password = data.get("password")

   admins = load_json(ADMINS_FILE)
   for admin in admins.values():
      if admin["username"] == username and admin["password"] == password:
            return jsonify(
               {"success": True, "role": "admin", "message": "Admin logged in"}
            )

   lecturers = load_json(LECTURERS_FILE)
   for lecturer in lecturers.values():
      if lecturer["username"] == username and lecturer["password"] == password:
            return jsonify(
               {
                  "success": True,
                  "role": "lecturer",
                  "message": "Lecturer logged in",
                  "name": lecturer.get("name", username),
                  "courses": lecturer.get("courses", []),
               }
            )
   users = load_json(STUDENTS_FILE)
   for user in users.values():
      if user["username"] == username and user["password"] == password:
         return jsonify({
               "success": True,
               "role": "student",
               "message": "Student logged in",
               "name": user.get("name", username),
               "courses": user.get("courses", [])
         })
   return jsonify({"success": False, "message": "Invalid username or password"}), 401


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
