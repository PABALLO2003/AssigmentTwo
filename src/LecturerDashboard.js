import React from 'react';
import { useNavigate } from 'react-router-dom';
import LecturerReportForm from './LecturerReportForm';
import ClassViewer from './ClassViewer'; 
import './LecturerDashboard.css';

function LecturerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lecturer_id');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="lecturer-container">
      <h2>Welcome to LIMKOKWING UNIVERSITY OF CREATIVE TECHNOLOGY - Lesotho  </h2>
      <h3>Lecturer Dashboard: Submit Reports & Manage Classes</h3>
      <LecturerReportForm />
      <ClassViewer /> 
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default LecturerDashboard;