const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
  db.query('SELECT module_id, module_name FROM Modules', (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch modules:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


router.post('/register', (req, res) => {
  const { student_id, module_id } = req.body;
  if (!student_id || !module_id) {
    return res.status(400).json({ error: 'Missing student_id or module_id' });
  }

  const query = `
    INSERT INTO student_modules (student_id, module_id, enrollment_date)
    VALUES (?, ?, NOW())
  `;
  db.query(query, [student_id, module_id], (err) => {
    if (err) {
      console.error('❌ Registration error:', err.message);
      return res.status(500).json({ error: 'Database error during registration' });
    }
    res.json({ message: '✅ Module registered successfully' });
  });
});


router.post('/register-multiple', (req, res) => {
  const { student_id, module_ids } = req.body;

  if (!student_id || !Array.isArray(module_ids) || module_ids.length !== 6) {
    return res.status(400).json({ error: 'You must register exactly 6 modules.' });
  }

  const values = module_ids.map(id => [student_id, id, new Date()]);
  const query = `
    INSERT INTO student_modules (student_id, module_id, enrollment_date)
    VALUES ?
  `;

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('❌ Bulk registration error:', err.message);
      return res.status(500).json({ error: 'Database error during bulk registration' });
    }
    res.json({ message: '✅ Modules registered successfully', affectedRows: result.affectedRows });
  });
});


router.post('/unregister', (req, res) => {
  const { student_id, module_id } = req.body;

  if (!student_id || !module_id) {
    return res.status(400).json({ error: 'Missing student_id or module_id' });
  }

  const query = `
    DELETE FROM student_modules
    WHERE student_id = ? AND module_id = ?
  `;

  db.query(query, [student_id, module_id], (err, result) => {
    if (err) {
      console.error('❌ Unregistration error:', err.message);
      return res.status(500).json({ error: 'Database error during unregistration' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Module not found or not registered' });
    }

    res.json({ message: '✅ Module unregistered successfully' });
  });
});


router.post('/assign-module', (req, res) => {
  const { module_id, lecturer_id } = req.body;

  const query = 'UPDATE Modules SET lecturer_id = ? WHERE module_id = ?';
  db.query(query, [lecturer_id, module_id], (err, result) => {
    if (err) {
      console.error('❌ Assignment error:', err.message);
      return res.status(500).json({ error: 'Database error during assignment' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json({ message: '✅ Module assigned successfully' });
  });
});


router.post('/pl/courses', (req, res) => {
  const { name, code, pl_id, semester } = req.body;

  if (!name || !code || !pl_id || !semester) {
    return res.status(400).json({ error: 'Missing course name, code, semester, or PL ID' });
  }

  
  db.query('SELECT program, department FROM PL WHERE pl_id = ?', [pl_id], (err, results) => {
    if (err) {
      console.error('❌ PL lookup error:', err.message);
      return res.status(500).json({ error: 'Database error during PL lookup' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'PL not found' });
    }

    const { program, department } = results[0];

    const query = `
      INSERT INTO courses (course_name, course_code, program, semester, faculty)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [name, code, program, semester, department], (err, result) => {
      if (err) {
        console.error('❌ Course creation error:', err.message);
        return res.status(500).json({ error: 'Database error during course creation' });
      }
      res.json({ message: '✅ Course added successfully', course_id: result.insertId });
    });
  });
});


router.get('/registered/:student_id', (req, res) => {
  const student_id = req.params.student_id;
  const query = `
    SELECT m.module_id, m.module_name
    FROM student_modules sm
    JOIN Modules m ON sm.module_id = m.module_id
    WHERE sm.student_id = ?
  `;
  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error('❌ Fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;