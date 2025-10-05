import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Registration.css';

function Registration() {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [message, setMessage] = useState('');
  const studentId = localStorage.getItem('student_id');

  
  useEffect(() => {
    axios.get('http://localhost:5000/api/modules')
      .then(res => setModules(res.data))
      .catch(() => {
        setModules([]);
        setMessage('✘ Failed to load modules.');
      });
  }, []);

  const handleSelectionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedModules(selected);

    if (selected.length < 6) {
      setMessage('⚠️ Please select exactly 6 modules to proceed.');
    } else if (selected.length > 6) {
      setMessage('⚠️ You can only select 6 modules.');
    } else {
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedModules.length !== 6) {
      setMessage('⚠️ You must select exactly 6 modules.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/modules/register-multiple', {
        student_id: studentId,
        module_ids: selectedModules
      });
      setMessage('✅ Modules registered successfully!');
      setSelectedModules([]);
    } catch (err) {
      setMessage('❌ Registration failed. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <h3>📚 Register for Modules</h3>
      <form onSubmit={handleSubmit}>
        <select
          multiple
          value={selectedModules}
          onChange={handleSelectionChange}
          required
          size={6}
        >
          {modules.map((mod) => (
            <option key={mod.module_id} value={mod.module_id}>
              {mod.module_name}
            </option>
          ))}
        </select>

       
        <button type="submit" disabled={selectedModules.length !== 6}>
          Register
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Registration;