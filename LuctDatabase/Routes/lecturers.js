const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const query = `
    SELECT 
      l.lecturer_id,
      CONCAT(l.name, ' ', l.surname) AS full_name,
      u.user_id AS ratee_id,
      u.email
    FROM Lecturers l
    JOIN Users u ON l.email = u.email
    WHERE u.role = 'Lecturer'
    ORDER BY l.lecturer_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch lecturer-user mapping:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('✅ Lecturer list fetched:', results.length);
    res.json(results);
  });
});

module.exports = router;