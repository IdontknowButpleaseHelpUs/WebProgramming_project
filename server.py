from flask import Flask, jsonify
from flask_cors import CORS
from database.database import courses

app = Flask(__name__)
CORS(app)

@app.route("/api/courses")
def get_courses():
   return jsonify(courses)

if __name__ == "__main__":
   app.run(debug=True)
