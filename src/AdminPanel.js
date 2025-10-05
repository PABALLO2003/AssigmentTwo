import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import axios from 'axios';

function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignment, setAssignment] = useState({
    course_id: '',
    module_id: '',
    lecturer_id: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
   
    axios.get('http://localhost:5000/api/courses')
      .then(res => {
        console.log('✅ Courses:', res.data);
        setCourses(res.data);
      })
      .catch(err => {
        console.error('❌ Course fetch failed:', err.message);
        setCourses([]);
      });

   
    axios.get('http://localhost:5000/api/modules')
      .then(res => setModules(res.data))
      .catch(err => {
        console.error('❌ Module fetch failed:', err.message);
        setModules([]);
      });

    
    axios.get('http://localhost:5000/api/lecturers')
      .then(res => setLecturers(res.data))
      .catch(err => {
        console.error('❌ Lecturer fetch failed:', err.message);
        setLecturers([]);
      });
  }, []);

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/assign-module', assignment);
      setMessage('✅ Module assigned successfully!');
      setAssignment({ course_id: '', module_id: '', lecturer_id: '' });
    } catch (err) {
      console.error('❌ Assignment error:', err.message);
      setMessage(`❌ Assignment failed: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Program Leader Dashboard</h2>

      <section>
        <h3>📚 All Courses</h3>
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <ul>
            {courses.map(course => (
              <li key={course.course_id}>
                <strong>{course.course_name}</strong> ({course.course_code}) – {course.program}, Semester {course.semester}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>🧩 Assign Module to Lecturer</h3>
        <form onSubmit={handleAssign}>
          <select name="course_id" value={assignment.course_id} onChange={handleChange} required>
            <option value="">Select Course</option>
            {courses.map(c => (
              <option key={c.course_id} value={c.course_id}>
                {c.course_name}
              </option>
            ))}
          </select>

          <select name="module_id" value={assignment.module_id} onChange={handleChange} required>
            <option value="">Select Module</option>
            {modules.map(m => (
              <option key={m.module_id} value={m.module_id}>
                {m.module_name}
              </option>
            ))}
          </select>

          <select name="lecturer_id" value={assignment.lecturer_id} onChange={handleChange} required>
            <option value="">Select Lecturer</option>
            {lecturers.map(l => (
              <option key={l.lecturer_id} value={l.lecturer_id}>
                {l.full_name}
              </option>
            ))}
          </select>

          <button type="submit">Assign Module</button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>
    </div>
  );
}

export default AdminPanel;