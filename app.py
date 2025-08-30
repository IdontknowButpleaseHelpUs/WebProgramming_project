from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)
COURSES_FILE = 'database/courses.json'
USERS_FILE = 'database/users.json'
ADMINS_FILE = 'database/admins.json'


def load_json(filename):
   if os.path.exists(filename):
      with open(filename, 'r') as file:
            return json.load(file)
   return {}

def save_json(filename, data):
   with open(filename, 'w') as file:
      json.dump(data, file, indent=4)

@app.route('/api/courses', methods=['GET'])
def get_courses():
   courses = load_json(COURSES_FILE)
   return jsonify(courses)

@app.route('/api/users', methods=['GET'])
def get_users():
   users = load_json(USERS_FILE)
   return jsonify(users)

@app.route('/')
def index():
   return render_template('page1.html')

@app.route('/admin')
def admin_panel():
   return render_template('page1.html')

@app.route('/api/admin-login', methods=['POST'])
def admin_login():
   data = request.json
   username = data.get('username')
   password = data.get('password')

   admins = load_json(ADMINS_FILE)
   
   # Check credentials
   for admin in admins.values():
      if admin['username'] == username and admin['password'] == password:
            return jsonify({"success": True, "message": "Login successful", "username":username})
   
   return jsonify({"success": False, "message": "Invalid username or password"})

if __name__ == '__main__':
   app.run(debug=True)


