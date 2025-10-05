import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClassViewer() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const lecturerId = localStorage.getItem('lecturer_id');

  useEffect(() => {
    if (!lecturerId) {
      console.warn('❌ No lecturer ID found. Please log in again.');
      setError('❌ Lecturer ID missing. Please log in again.');
      return;
    }

    axios.get(`http://localhost:5000/api/classes?lecturer_id=${lecturerId}`)
      .then(res => setClasses(res.data))
      .catch(err => {
        console.error('❌ Class fetch failed:', err.message);
        setError('❌ Failed to load assigned classes.');
        setClasses([]);
      });
  }, [lecturerId]);

  const styles = {
    container: {
      marginTop: '20px',
      padding: '15px',
      border: '1px solid #000',
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#000',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      borderBottom: '1px solid #000',
      paddingBottom: '5px'
    },
    listItem: {
      padding: '6px 0',
      borderBottom: '1px solid #ccc'
    },
    error: {
      color: 'red',
      fontWeight: 'bold',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📘 Your Assigned Classes</h3>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : classes.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        <ul>
          {classes.map(cls => (
            <li key={cls.id} style={styles.listItem}>
              <strong>{cls.module_name}</strong> – {cls.day} at {cls.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClassViewer;