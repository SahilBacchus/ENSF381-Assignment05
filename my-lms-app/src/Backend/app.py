from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load courses data
with open('courses.json', 'r') as f:
    courses = json.load(f)



# 6. Get All Courses API
@app.route('/courses', methods=['GET'])
def get_courses():
    return jsonify(courses)




if __name__ == '__main__':
    app.run(debug=True)