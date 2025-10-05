const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
require('dotenv').config();


router.get('/login', (req, res) => {
  res.send('🔐 Login route is active. Use POST to authenticate.');
});


router.post('/login', (req, res) => {
  const { login_id, password, role } = req.body;

  if (!login_id || !password || !role) {
    return res.status(400).json({ error: 'Login ID, password, and role are required' });
  }

  const normalizedRole = role.toLowerCase();
  const hashedInput = crypto.createHash('sha256').update(password.trim()).digest('hex');

  let table, idField, passwordField;

  switch (normalizedRole) {
    case 'student':
      table = 'Students';
      idField = 'student_id';
      passwordField = 'password';
      break;

    case 'lecturer':
      table = 'Lecturers';
      idField = 'lecturer_id';
      passwordField = 'password';
      break;

    case 'pl':
      table = 'PL';
      idField = 'user_id';
      passwordField = 'password';
      break;

    case 'prl':
      table = 'PRL';
      idField = 'user_id';               
      passwordField = 'password_hash';   
      break;

    default:
      return res.status(400).json({ error: 'Invalid role specified' });
  }

  db.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [login_id], (err, results) => {
    if (err) {
      console.error('❌ Login DB error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid login ID' });
    }

    const user = results[0];
    const storedPassword = user[passwordField];

    if (!storedPassword || hashedInput !== storedPassword.trim()) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET in .env');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user[idField], role: normalizedRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    
    switch (normalizedRole) {
      case 'lecturer':
        return res.status(200).json({
          token,
          role: normalizedRole,
          user_id: login_id,
          lecturer_id: user.lecturer_id,
          name: user.name,
          surname: user.surname,
          venue: user.venue_preference || ''
        });

      case 'student':
        return res.status(200).json({
          token,
          role: normalizedRole,
          user_id: login_id,
          student_id: user.student_id,
          name: user.name,
          surname: user.surname,
          program: user.program,
          status: user.status
        });

      case 'prl': {
        const [firstName, lastName] = (user.full_name || '').split(' ');
        return res.status(200).json({
          token,
          role: normalizedRole,
          user_id: user.user_id,
          prl_id: user.prl_id,
          name: firstName || '',
          surname: lastName || '',
          email: user.email
        });
      }

      case 'pl': {
        const [firstName, lastName] = (user.full_name || '').split(' ');
        return res.status(200).json({
          token,
          role: normalizedRole,
          user_id: user.user_id,
          pl_id: user.pl_id,
          name: firstName || '',
          surname: lastName || '',
          program: user.program,
          department: user.department,
          email: user.email
        });
      }
    }

    return res.status(500).json({ error: 'Unhandled role response' });
  });
});

module.exports = router;