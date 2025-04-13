import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CourseItem from './CourseItem';
import EnrollmentList from './EnrollmentList';
// import courses from '../data/courses';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const studentId = localStorage.getItem('student_id'); 



  // Fetch courses from backend
  useEffect(() => {
    fetch('http://localhost:5000/courses')
      .then(response => {
        if (!response.ok) console.error("Failed to fetch");
        return response.json();
      })
      .then(data => {
        setCourses(data);
      })
      .catch(err => {
        console.log("Error: ", err.message);
      });
  }, []);
  
  
  // Fetch enrolled courses from backend
  useEffect(() => {
    if (!studentId){
      alert("User must be logged in before enrolling");
      return;  
    }
  
    fetch(`http://localhost:5000/student_courses/${studentId}`)
      .then((response) => response.json())
      .then((data) => {
        setEnrolledCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [studentId]);


  // // Save to localStorage
  // useEffect(() => {
  //   localStorage.setItem('enrollments', JSON.stringify(enrolledCourses));
  // }, [enrolledCourses]);


  // Handle enrolling in course
  const handleEnroll = async (course) => {
    if (!studentId){
      alert("User must be logged in before enrolling");
      return;  
    }
  
    try {
      const response = await fetch(`http://localhost:5000/enroll/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
  
      const data = await response.json();
  
      if (response.ok && data.msg === 'Enrollment successful') {
          console.log('Course enrolled successfully:', data.msg);
          setEnrolledCourses(prev => [...prev, {
            ...course,
            enrollmentId: Date.now(),
          }]);
        } else {
          console.error('Enrollment failed with backend message:', data.msg);
          alert(`Error: ${data.msg}`);
        }
    } catch (error) {
      console.error('Error:', error);
      alert(`Something went wrong during enrollment: ${error}`);
    }
  };



  //Handle dropping a course
  const handleRemove = async (enrollmentId) => {
    if (!studentId){
      alert("User must be logged in before dropping"); 
      return; 
    }

    const courseToDrop = enrolledCourses.find(course => course.enrollmentId === enrollmentId);
    if (!courseToDrop) {
      alert("Course not found.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/drop/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseToDrop),
      });
  
      const data = await response.json();
  
      if (response.ok && data.msg === 'Course dropped successfully') {
          console.log('Dropped course:', courseToDrop.title);
          setEnrolledCourses(prev =>
            prev.filter(course => course.enrollmentId !== enrollmentId)
          );
        } else {
          alert(`Error: ${data.msg}`);
        }
      
    } catch (error) {
      console.error("Error dropping course:", error);
      alert(`An error occurred while dropping the course: ${error}`);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Header />
      
      <div style={{ 
        flex: 1,
        display: 'flex',
        padding: '20px',
        gap: '30px'
      }}>
        <div style={{ flex: 3 }}>
          <h2 style={{ color: '#004080' }}>Available Courses</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {courses.map(course => (
              <CourseItem 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>
        
        <EnrollmentList 
          enrolledCourses={enrolledCourses}
          onRemove={handleRemove}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
