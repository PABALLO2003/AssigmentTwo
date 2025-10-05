import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Registration from './Registration';
import ViewModules from './ViewModules';
import axios from 'axios';
import './StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem('student_id');
  const studentName = localStorage.getItem('student_name');
  const studentSurname = localStorage.getItem('student_surname');
  const studentProgram = localStorage.getItem('student_program');

  const [lecturers, setLecturers] = useState([]);
  const [ratingForm, setRatingForm] = useState({
    ratee_id: '',
    role: 'Lecturer',
    module_id: null,
    rating_value: '',
    comments: ''
  });
  const [ratingMessage, setRatingMessage] = useState('');

  useEffect(() => {
    if (!studentId) {
      console.warn('No student_id found in localStorage. Redirecting to login...');
      navigate('/login');
    }
  }, [studentId, navigate]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/lecturers')
      .then(res => {
        console.log('✅ Lecturer data:', res.data);
        setLecturers(res.data);
      })
      .catch(err => {
        console.error('❌ Failed to load lecturers:', err.message);
        setLecturers([]);
      });
  }, []);

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;
    localStorage.clear();
    navigate('/');
  };

  const handleRatingChange = (e) => {
    setRatingForm({ ...ratingForm, [e.target.name]: e.target.value });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to submit this rating?");
    if (!confirm) return;

    if (!ratingForm.ratee_id || !ratingForm.rating_value) {
      setRatingMessage('❌ Please select a lecturer and rating value');
      return;
    }

    const raterId = Number(studentId);
    if (!raterId || isNaN(raterId)) {
      setRatingMessage('❌ Invalid student ID. Please log in again.');
      return;
    }

    try {
      const payload = {
        ...ratingForm,
        rater_id: raterId,
        rating_value: Number(ratingForm.rating_value),
        module_id: null
      };

      console.log("📤 Submitting rating payload:", payload);

      await axios.post('http://localhost:5000/api/ratings', payload);
      setRatingMessage('✅ Rating submitted successfully');
      setRatingForm({
        ratee_id: '',
        rating_value: '',
        comments: '',
        role: 'Lecturer',
        module_id: null
      });
    } catch (err) {
      console.error('❌ Rating submission error:', err.message);
      setRatingMessage('❌ Failed to submit rating');
    }
  };

  return (
    <div className="student-container">
      <h2>Welcome to LIMKOKWING UNIVERSITY OF CREATIVE TECHNOLOGY - Lesotho</h2>
      <p>This is your space to view modules, assignments, and announcements.</p>

      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
        <h3>👋 Welcome {studentName} {studentSurname} (ID: {studentId})</h3>
        <p>🎓 Program: {studentProgram}</p>
      </div>

      <Registration />
      <ViewModules />

      <button
        onClick={() => navigate('/student/monitoring')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#060b10ff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        View Registered Modules
      </button>

      <form onSubmit={handleRatingSubmit} className="rating-form">
        <h3>⭐ Rate a Lecturer</h3>

        <select
          name="ratee_id"
          value={ratingForm.ratee_id}
          onChange={handleRatingChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            backgroundColor: '#fff',
            color: '#333'
          }}
        >
          <option value="">Select Lecturer</option>
          {lecturers.length === 0 ? (
            <option disabled>No lecturers found</option>
          ) : (
            lecturers.map(lect => (
              <option
                key={lect.lecturer_id}
                value={lect.lecturer_id}
                title={`Venue: ${lect.venue_preference}, Modules: ${lect.module_count}`}
              >
                {lect.full_name}
              </option>
            ))
          )}
        </select>

        <select
          name="rating_value"
          value={ratingForm.rating_value}
          onChange={handleRatingChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            backgroundColor: '#fff',
            color: '#333'
          }}
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map(val => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>

        <textarea
          name="comments"
          placeholder="Optional comments"
          value={ratingForm.comments}
          onChange={handleRatingChange}
          rows="4"
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            backgroundColor: '#fff',
            color: '#333'
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#0e1810ff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          title="Submit your rating for the selected lecturer"
        >
          Submit Rating
        </button>

        {ratingMessage && <p>{ratingMessage}</p>}
      </form>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudentDashboard;