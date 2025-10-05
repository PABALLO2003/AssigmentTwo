import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Monitoring() {
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const studentId = localStorage.getItem('student_id');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/modules/registered/${studentId}`)
      .then(res => setModules(res.data))
      .catch(() => setError('❌ Failed to load registered modules.'));
  }, [studentId]);

  const filteredModules = modules.filter(mod =>
    mod.module_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '30px auto',
      padding: '20px',
      backgroundColor: '#f9f9ff',
      borderRadius: '10px',
      boxShadow: '0 0 12px rgba(0, 0, 0, 0.08)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    },
    heading: {
      fontSize: '22px',
      marginBottom: '15px',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '16px',
    },
    list: {
      listStyleType: 'none',
      paddingLeft: 0,
    },
    item: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
      fontSize: '16px',
      color: '#444',
    },
    error: {
      color: 'red',
      fontWeight: 'bold',
    },
    message: {
      fontSize: '16px',
      color: '#666',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📚 Your Registered Modules</h3>
      <input
        type="text"
        placeholder="Search modules..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      {filteredModules.length === 0 ? (
        <p style={styles.message}>No modules found.</p>
      ) : (
        <ul style={styles.list}>
          {filteredModules.map(mod => (
            <li key={mod.module_id} style={styles.item}>
              {mod.module_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Monitoring;