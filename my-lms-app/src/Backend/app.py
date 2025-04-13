from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication


class Student:
    id = None
    username = ''
    password = ''
    email = ''
    enrolled_courses = []

    def __init__(self, id, username, password, email):
        self.id = id
        self.username = username
        self.password = password
        self.email = email


students = []
id = 0


# Load testimonial data
with open('testimonials.json', 'r') as file: 
    testimonials = json.load(file)

# Load courses data
with open('courses.json', 'r') as file:
    courses = json.load(file)




# 1. Student Registration API
@app.route('/signup', methods=['POST'])
def register():
    global id
    data = request.get_json()
    print("Data recieved:", data)
    for student in students:
        if data['username'] == student.username:
            return {'msg':'exists'}
    
    students.append(Student(id, data['username'], data['password'], data['email']))
    id += 1
    return {'msg':'success', 'id':id}


# 2. Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    for student in students:
        if data['username'] == student.username and data['password'] == student.password:
            return {'msg':'success', 'id':id}
    
    return {'msg':'failed'}


# 3. Testimonials API
@app.route('/testimonials', methods=['GET'])
def get_testimonials():
    random.shuffle(testimonials)
    return jsonify(testimonials[:2])


# 4. Enroll Courses API
@app.route('/enroll/<int:student_id>', methods=['POST'])
def enroll_course(student_id):
    course = request.get_json()
    print(f"Enroll student: {student_id} in {course}")

    for student in students:
        if student.id == student_id:
            student.enrolled_courses.append(course)
            return jsonify({'msg': 'Enrollment successful'})

    return jsonify({'msg': 'Student not found'})


# 5. Delete Courses API
@app.route('/drop/<int:student_id>', methods=['DELETE'])
def drop_course(student_id):
    data = request.get_json()
    print(f"Drop student: {student_id} in {data}")

    for student in students:
        if student.id == student_id:
            original_count = len(student.enrolled_courses)

            # Remove course by matching course id
            student.enrolled_courses = [course for course in student.enrolled_courses if course.get('id') != data.get('id')]

            if len(student.enrolled_courses) < original_count:
                return jsonify({'msg': 'Course dropped successfully'})
            else:
                return jsonify({'msg': 'Course not found in enrollment'})

    return jsonify({'msg': 'Student not found'})


# 6. Get All Courses API
@app.route('/courses', methods=['GET'])
def get_courses():
    return jsonify(courses)


# 7. Get Student Courses API
@app.route('/student_courses/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    for student in students:
        if student.id == student_id:
            return jsonify(student.enrolled_courses)

    return jsonify([])




if __name__ == '__main__':
    app.run(debug=True)