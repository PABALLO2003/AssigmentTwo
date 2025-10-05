const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/courses', (req, res) => {
  const { name, code } = req.body;
  db.query(
    'INSERT INTO courses (course_name, course_code) VALUES (?, ?)',
    [name, code],
    (err, result) => {
      if (err) {
        console.error('Course creation error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Course added successfully' });
    }
  );
});


router.post('/assign', (req, res) => {
  const { course_id, lecturer_id } = req.body;
  db.query(
    'UPDATE courses SET lecturer_id = ? WHERE course_id = ?',
    [lecturer_id, course_id],
    (err, result) => {
      if (err) {
        console.error('Lecturer assignment error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Lecturer assigned successfully' });
    }
  );
});


router.get('/reports', (req, res) => {
  db.query('SELECT * FROM reports WHERE reviewed_by_prl = 1', (err, results) => {
    if (err) {
      console.error('Report fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(Array.isArray(results) ? results : []);
  });
});

router.get('/pl/reports', (req, res) => {
  const plId = req.query.pl_id;

  if (!plId) {
    return res.status(400).json({ error: 'Missing PL ID' });
  }

  const query = `
    SELECT 
      r.report_id AS id,
      CONCAT(l.name, ' ', l.surname) AS lecturer_name,
      c.course_name,
      c.course_code,
      r.date_of_lecture,
      r.topic_taught AS topic,
      r.learning_outcomes,
      r.recommendations,
      r.status
    FROM reports r
    JOIN classes cl ON r.class_id = cl.class_id
    JOIN courses c ON cl.course_id = c.course_id
    JOIN lecturers l ON cl.lecturer_id = l.lecturer_id
    JOIN PL p ON p.pl_id = ?
    WHERE r.status = 'reviewed' AND c.program = p.program
    ORDER BY r.date_of_lecture DESC
  `;

  db.query(query, [plId], (err, results) => {
    if (err) {
      console.error('❌ PL report fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(Array.isArray(results) ? results : []);
  });
});

module.exports = router;
