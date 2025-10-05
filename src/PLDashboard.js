import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const businessCourses = [
  'Accounting', 'Business Management', 'Digital Marketing', 'Entrepreneurship', 'Economics'
];

const courseCodeMap = {
  Accounting: 'ACC101',
  'Business Management': 'BM101',
  'Digital Marketing': 'DM101',
  Entrepreneurship: 'ENT101',
  Economics: 'ECO101'
};

export default function PLDashboard() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignment, setAssignment] = useState({
    course_id: '', lecturer_id: '', course_code: '', total_students: '', venue_preference: ''
  });
  const [newCourse, setNewCourse] = useState({ name: '', code: '' });
  const [prlReports, setPrlReports] = useState([]);
  const [message, setMessage] = useState('');
  const [showCourses, setShowCourses] = useState(false);

  const API_BASE = 'http://localhost:5000/api';
  const userId = localStorage.getItem('pl_id');

  // ✅ Fetch all data
  const fetchAll = useCallback(async () => {
    if (!userId) return console.warn('⚠️ No PL ID found in localStorage');

    try {
      const [coursesRes, lecturersRes, reportsRes] = await Promise.all([
        axios.get(`${API_BASE}/courses`),
        axios.get(`${API_BASE}/lecturers`),
        axios.get(`${API_BASE}/pl/reports?pl_id=${userId}`)
      ]);

      // ✅ Use Array.isArray for safety
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setLecturers(Array.isArray(lecturersRes.data) ? lecturersRes.data : []);
      setPrlReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
    } catch (err) {
      console.error('❌ Fetch failed:', err.message);
      setCourses([]); setLecturers([]); setPrlReports([]);
    }
  }, [API_BASE, userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ✅ Update assignment when dropdown changes
  useEffect(() => {
    const selectedCourse = courses.find(c => String(c.course_id) === String(assignment.course_id));
    const selectedLecturer = lecturers.find(l => String(l.lecturer_id) === String(assignment.lecturer_id));

    setAssignment(prev => ({
      ...prev,
      course_code: selectedCourse?.course_code || '',
      total_students: prev.total_students || selectedCourse?.total_students || '',
      venue_preference: selectedLecturer?.venue_preference || ''
    }));
  }, [assignment.course_id, assignment.lecturer_id, courses, lecturers]);

  // ✅ Form handlers
  const handleChange = (e) => setAssignment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => name === 'name' ? { name: value, code: courseCodeMap[value] || '' } : { ...prev, [name]: value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignment.course_id || !assignment.lecturer_id) return setMessage('❌ Select both a course and a lecturer');
    try {
      await axios.post(`${API_BASE}/pl/assign`, { ...assignment, pl_id: userId });
      setMessage('✅ Lecturer assigned successfully');
      setAssignment({ course_id: '', lecturer_id: '', course_code: '', total_students: '', venue_preference: '' });
      fetchAll(); clearMessageAfterDelay();
    } catch (err) { console.error('❌ Assignment failed:', err.message); setMessage('❌ Failed to assign lecturer'); clearMessageAfterDelay(); }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name) return setMessage('❌ Please select a course name');
    try {
      await axios.post(`${API_BASE}/courses`, newCourse);
      setMessage('✅ Course added successfully'); setNewCourse({ name: '', code: '' });
      fetchAll(); clearMessageAfterDelay();
    } catch (err) { console.error('❌ Failed to add course:', err.message); setMessage('❌ Could not add course'); clearMessageAfterDelay(); }
  };

  const handleUpdateStudents = async () => {
    if (!assignment.course_id || !assignment.total_students) return setMessage('❌ Select a course and enter student count');
    try {
      await axios.put(`${API_BASE}/courses/${assignment.course_id}/students`, { total_students: assignment.total_students });
      setMessage('✅ Total students updated'); fetchAll(); clearMessageAfterDelay();
    } catch (err) { console.error('❌ Update failed:', err.message); setMessage('❌ Failed to update student count'); clearMessageAfterDelay(); }
  };

  const handleLogout = () => { localStorage.removeItem('pl_id'); window.location.href = '/login'; };
  const clearMessageAfterDelay = (ms = 4000) => setTimeout(() => setMessage(''), ms);

  // ✅ UI
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#fff', color: '#000' }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Program Leader Dashboard</h2>
      <button onClick={handleLogout} style={{ padding: 8, backgroundColor: '#000', color: '#fff', borderRadius: 4, marginBottom: 20 }}>🚪 Logout</button>

      {/* Add Course */}
      <form onSubmit={handleAddCourse} style={{ marginBottom: 30, padding: 15, borderRadius: 8, border: '1px solid #000', backgroundColor: '#f9f9f9' }}>
        <h3>📚 Add New Course</h3>
        <select name="name" value={newCourse.name} onChange={handleCourseChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }}>
          <option value="">Select Business Course</option>
          {businessCourses.map((name, i) => <option key={i} value={name}>{name}</option>)}
        </select>
        <input name="code" value={newCourse.code} readOnly style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <button type="submit" style={{ padding: 8, backgroundColor: '#000', color: '#fff', borderRadius: 4 }}>Add Course</button>
      </form>

      {/* Assign Lecturer */}
      <form onSubmit={handleAssign} style={{ marginBottom: 30, padding: 15, borderRadius: 8, border: '1px solid #000', backgroundColor: '#f9f9f9' }}>
        <h3>👨‍🏫 Assign Lecturer to Course</h3>
        <select name="course_id" value={assignment.course_id} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }}>
          <option value="">Select Course</option>
          {Array.isArray(courses) && courses.map(c => (
            <option key={c.course_id} value={c.course_id}>{c.course_name} ({c.course_code})</option>
          ))}
        </select>
        <select name="lecturer_id" value={assignment.lecturer_id} onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }}>
          <option value="">Select Lecturer</option>
          {Array.isArray(lecturers) && lecturers.length > 0 ? lecturers.map(l => (
            <option key={l.lecturer_id} value={l.lecturer_id}>{l.full_name || `${l.name} ${l.surname}`}</option>
          )) : <option disabled>No lecturers available</option>}
        </select>
        <input name="course_code" value={assignment.course_code} placeholder="Course Code" readOnly style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input name="total_students" type="number" value={assignment.total_students} onChange={handleChange} placeholder="Set Total Students" style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <button type="button" onClick={handleUpdateStudents} style={{ padding: 8, backgroundColor: '#000', color: '#fff', marginRight: 8 }}>Update Total Students</button>
        <input name="venue_preference" value={assignment.venue_preference} placeholder="Lecturer's Venue Preference" readOnly style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <button type="submit" style={{ padding: 8, backgroundColor: '#000', color: '#fff' }}>Assign Lecturer</button>
        {message && <div style={{ marginTop: 10, fontWeight: 'bold' }}>{message}</div>}
      </form>

      {/* PRL Reports */}
      <div style={{ marginBottom: 30, padding: 15, borderRadius: 8, border: '1px solid #000', backgroundColor: '#f9f9f9' }}>
        <h3>📝 PRL Reports</h3>
        {Array.isArray(prlReports) && prlReports.length > 0 ? prlReports.map(r => (
          <div key={r.report_id || r.id || Math.random()} style={{ marginBottom: 15, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
            {r.course_name && <p><strong>Course:</strong> {r.course_name} ({r.course_code || 'N/A'})</p>}
            {r.lecturer_name && <p><strong>Lecturer:</strong> {r.lecturer_name}</p>}
            {r.topic_taught && <p><strong>Topic:</strong> {r.topic_taught}</p>}
            {r.learning_outcomes && <p>{r.learning_outcomes}</p>}
            {r.recommendations && <p><em>Recommendations:</em> {r.recommendations}</p>}
            {r.date_of_lecture && <small>Date: {new Date(r.date_of_lecture).toLocaleDateString()}</small>}
            {r.status && <p><strong>Status:</strong> {r.status}</p>}
          </div>
        )) : <p>No reports available.</p>}
      </div>

      {/* Course List */}
      <div>
        <button onClick={() => setShowCourses(!showCourses)} style={{ padding: 8, backgroundColor: '#000', color: '#fff', borderRadius: 4 }}>
          {showCourses ? 'Hide' : 'Show'} All Courses
        </button>
        {showCourses && (
          <div style={{ marginTop: 20 }}>
            <h3>📋 All Courses</h3>
            {Array.isArray(courses) && courses.length > 0 ? courses.map(c => (
              <div key={c.course_id} style={{ padding: 8, borderBottom: '1px solid #ccc' }}>
                {c.course_name} ({c.course_code}) - Students: {c.total_students ?? 'N/A'}
              </div>
            )) : <p>No courses available.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
