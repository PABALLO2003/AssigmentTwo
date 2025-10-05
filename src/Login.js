import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from './image.png';

function Login() {
  const [login_id, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    localStorage.clear();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        login_id,
        password,
        role,
      });

      const {
        token,
        student_id,
        lecturer_id,
        prl_id,
        pl_id,
        name,
        surname,
        program,
        department,
        email,
      } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user_id', login_id); // ✅ critical fix

      switch (role.toLowerCase()) {
        case 'student':
          localStorage.setItem('student_id', student_id);
          localStorage.setItem('student_name', name);
          localStorage.setItem('student_surname', surname);
          localStorage.setItem('student_program', program);
          navigate('/student');
          break;
        case 'lecturer':
          localStorage.setItem('lecturer_id', lecturer_id || login_id);
          navigate('/lecturer');
          break;
        case 'prl':
          localStorage.setItem('prl_id', prl_id || login_id);
          localStorage.setItem('prl_name', name);
          localStorage.setItem('prl_surname', surname);
          localStorage.setItem('prl_email', email);
          navigate('/prl');
          break;
        case 'pl':
          localStorage.setItem('pl_id', pl_id || login_id);
          localStorage.setItem('pl_name', name);
          localStorage.setItem('pl_surname', surname);
          localStorage.setItem('pl_program', program);
          localStorage.setItem('pl_department', department);
          navigate('/pl');
          break;
        default:
          setError('Unknown role');
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Login Logo" className="login-logo" />
      <h2>Login Portal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login ID"
          value={login_id}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="prl">PRL</option>
          <option value="pl">PL</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {role && <p className="role-hint">Logging in as <strong>{role.toUpperCase()}</strong></p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;