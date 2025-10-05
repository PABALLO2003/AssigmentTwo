import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LecturerReportForm() {
  const [form, setForm] = useState({
    faculty_name: 'Faculty of ICT',
    class_name: '',
    week: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    lecturer_name: localStorage.getItem('lecturer_name') || '',
    students_present: '',
    total_registered: '',
    venue: '',
    scheduled_time: '',
    topic: '',
    outcomes: '',
    recommendations: ''
  });

  const [courses, setCourses] = useState([]);
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));

    axios.get('http://localhost:5000/api/venues')
      .then(res => setVenues(res.data))
      .catch(() => setVenues([]));
  }, []);

  useEffect(() => {
    const selected = courses.find(c => c.course_name === form.course_name);
    if (selected) {
      setForm(prev => ({
        ...prev,
        course_code: selected.course_code,
        total_registered: selected.total_registered || ''
      }));
    }
  }, [form.course_name, courses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reports/submit', form);
      setMessage('✅ Report submitted successfully!');
      setForm(prev => ({
        ...prev,
        week: '',
        date_of_lecture: '',
        course_name: '',
        course_code: '',
        students_present: '',
        total_registered: '',
        venue: '',
        scheduled_time: '',
        topic: '',
        outcomes: '',
        recommendations: ''
      }));
    } catch (err) {
      setMessage('❌ Submission failed. Please try again.');
    }
  };

  const styles = {
    form: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
    },
    input: {
      display: 'block',
      marginBottom: '10px',
      padding: '10px',
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    select: {
      display: 'block',
      marginBottom: '10px',
      padding: '10px',
      width: '100%',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    textarea: {
      display: 'block',
      marginBottom: '10px',
      padding: '10px',
      width: '100%',
      height: '80px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    message: {
      marginTop: '10px',
      fontWeight: 'bold',
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input name="faculty_name" value={form.faculty_name} readOnly style={styles.input} />
      <input name="class_name" placeholder="Class Name" value={form.class_name} onChange={handleChange} required style={styles.input} />
      <input name="week" placeholder="Week of Reporting" value={form.week} onChange={handleChange} required style={styles.input} />
      <input type="date" name="date_of_lecture" value={form.date_of_lecture} onChange={handleChange} required style={styles.input} />

      <select name="course_name" value={form.course_name} onChange={handleChange} required style={styles.select}>
        <option value="">Select Course</option>
        {courses.map(c => (
          <option key={c.course_id} value={c.course_name}>
            {c.course_name}
          </option>
        ))}
      </select>

      <input name="course_code" value={form.course_code} readOnly style={styles.input} />
      <input name="lecturer_name" value={form.lecturer_name} readOnly style={styles.input} />
      <input name="students_present" placeholder="Students Present" type="number" value={form.students_present} onChange={handleChange} required style={styles.input} />
      <input name="total_registered" value={form.total_registered} readOnly style={styles.input} />

      <select name="venue" value={form.venue} onChange={handleChange} required style={styles.select}>
        <option value="">Select Venue</option>
        {venues.map(v => (
          <option key={v.venue_id} value={v.venue_name}>
            {v.venue_name}
          </option>
        ))}
      </select>

      <input name="scheduled_time" type="time" value={form.scheduled_time} onChange={handleChange} required style={styles.input} />
      <textarea name="topic" placeholder="Topic Taught" value={form.topic} onChange={handleChange} required style={styles.textarea} />
      <textarea name="outcomes" placeholder="Learning Outcomes" value={form.outcomes} onChange={handleChange} required style={styles.textarea} />
      <textarea name="recommendations" placeholder="Lecturer’s Recommendations" value={form.recommendations} onChange={handleChange} required style={styles.textarea} />

      <button type="submit" style={styles.button}>Submit Report</button>
      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
}

export default LecturerReportForm;