const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/assign-module', (req, res) => {
  const { course_id, module_id, lecturer_id } = req.body;

  console.log('📥 Incoming assignment:', req.body);


  if (!course_id || !module_id || !lecturer_id) {
    console.warn('⚠️ Missing fields:', { course_id, module_id, lecturer_id });
    return res.status(400).json({ error: 'Missing required fields' });
  }


  const query = 'INSERT INTO assignments (course_id, module_id, lecturer_id) VALUES (?, ?, ?)';
  db.query(query, [course_id, module_id, lecturer_id], (err, result) => {
    if (err) {
      console.error('❌ Assignment DB error:', err);
      return res.status(500).json({ error: err.message }); 
    }

    console.log('✅ Assignment inserted:', result);
    res.status(200).json({ message: 'Module assigned successfully' });
  });
});

module.exports = router;