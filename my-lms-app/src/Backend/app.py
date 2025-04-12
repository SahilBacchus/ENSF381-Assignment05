from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication



# Load testimonial data
with open('testimonials.json', 'r') as file: 
    testimonials = json.load(file)

# Load courses data
with open('courses.json', 'r') as file:
    courses = json.load(file)






# 3. Testimonials API
@app.route('/testimonials', methods=['GET'])
def get_testimonials():
    random.shuffle(testimonials)
    return jsonify(testimonials[:2])


# 6. Get All Courses API
@app.route('/courses', methods=['GET'])
def get_courses():
    return jsonify(courses)





if __name__ == '__main__':
    app.run(debug=True)