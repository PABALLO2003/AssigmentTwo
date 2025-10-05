import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewModules() {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredButton, setHoveredButton] = useState(null);

  const studentId = localStorage.getItem('student_id');

  useEffect(() => {
    if (!studentId) {
      console.warn('No student ID found. Please log in again.');
      setError('❌ No student ID found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchModules = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/modules/registered/${studentId}`);
        setModules(res.data);
        setFilteredModules(res.data);
      } catch (err) {
        console.error("❌ Module fetch error:", err.message);
        setError('❌ Failed to load registered modules.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [studentId]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = modules.filter(mod =>
      mod.module_name.toLowerCase().includes(query)
    );
    setFilteredModules(filtered);
  };

  const handleUnregister = async (moduleId) => {
    if (!window.confirm("Are you sure you want to unregister this module?")) return;

    try {
      await axios.post('http://localhost:5000/api/modules/unregister', {
        student_id: studentId,
        module_id: moduleId
      });

      const res = await axios.get(`http://localhost:5000/api/modules/registered/${studentId}`);
      setModules(res.data);
      setFilteredModules(res.data.filter(mod =>
        mod.module_name.toLowerCase().includes(searchQuery)
      ));
    } catch (err) {
      console.error('❌ Unregister error:', err.message);
      alert('❌ Failed to unregister module.');
    }
  };

  const styles = {
    container: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      marginBottom: '15px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      borderBottom: '2px solid #030405ff',
      paddingBottom: '5px',
    },
    search: {
      marginBottom: '15px',
      padding: '10px',
      width: '100%',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    list: {
      listStyleType: 'none',
      paddingLeft: 0,
    },
    item: {
      padding: '12px',
      borderBottom: '1px solid #ccc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '6px',
      marginBottom: '8px',
    },
    info: {
      flexGrow: 1,
      fontSize: '16px',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#0a0606ff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s ease',
    },
    error: {
      color: 'red',
      fontWeight: 'bold',
      marginTop: '10px',
    },
    loading: {
      fontStyle: 'italic',
      color: '#555',
      marginTop: '10px',
      textAlign: 'center',
    }
  };

  if (loading) {
    return <p style={styles.loading}>⏳ Loading your modules...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📚 Registered Modules</h3>
      <input
        type="text"
        placeholder="Search modules..."
        onChange={handleSearch}
        style={styles.search}
      />
      {filteredModules.length === 0 ? (
        <p>No modules match your search.</p>
      ) : (
        <ul style={styles.list}>
          {filteredModules.map((mod) => (
            <li key={mod.module_id} style={styles.item}>
              <div style={styles.info}>
                <strong>{mod.module_name}</strong>
              </div>
              <button
                style={{
                  ...styles.button,
                  backgroundColor:
                    hoveredButton === mod.module_id ? '#b30000' : styles.button.backgroundColor
                }}
                onMouseEnter={() => setHoveredButton(mod.module_id)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleUnregister(mod.module_id)}
              >
                Unregister
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewModules;