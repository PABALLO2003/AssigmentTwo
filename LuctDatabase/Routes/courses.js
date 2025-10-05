const express = require('express');
const router = express.Router();
const db = require('../db'); 


router.get('/', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      console.error('❌ Course fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!results || results.length === 0) {
      console.warn('⚠️ No courses found.');
      return res.status(404).json({ error: 'No courses available' });
    }

    console.log(`✅ ${results.length} courses fetched`);
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { name, code, program, semester, faculty } = req.body;

  if (!name || !code || !program || !semester || !faculty) {
    return res.status(400).json({ error: 'All course fields are required' });
  }

  const query = `
    INSERT INTO courses (course_name, course_code, program, semester, faculty)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [name, code, program, semester, faculty], (err, result) => {
    if (err) {
      console.error('❌ Course insert error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log(`✅ Course "${name}" added with code "${code}"`);
    res.status(201).json({ message: 'Course added successfully', course_id: result.insertId });
  });
});


router.put('/:id/students', (req, res) => {
  const courseId = req.params.id;
  const { total_students } = req.body;

  if (total_students === undefined || isNaN(total_students)) {
    return res.status(400).json({ error: 'Valid total_students value required' });
  }

  db.query(
    'UPDATE courses SET total_students = ? WHERE course_id = ?',
    [total_students, courseId],
    (err, result) => {
      if (err) {
        console.error('❌ Update error:', err.message);
        return res.status(500).json({ error: 'Database error during update' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: '✅ Total students updated successfully' });
    }
  );
});

module.exports = router;