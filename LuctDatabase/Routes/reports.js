const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/reports', (req, res) => {
  db.query('SELECT * FROM reports', (err, results) => {
    if (err) {
      console.error('❌ Fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


router.get('/prl/:user_id/reports', (req, res) => {
  const user_id = req.params.user_id;

  
  db.query('SELECT prl_id FROM PRL WHERE user_id = ?', [user_id], (err, prlResult) => {
    if (err) {
      console.error('❌ PRL lookup error:', err.message);
      return res.status(500).json({ error: 'Database error during PRL lookup' });
    }
    if (!prlResult.length) {
      return res.status(404).json({ error: 'PRL not found' });
    }

    const prl_id = prlResult[0].prl_id;

   
    const query = `
      SELECT r.*, c.course_name, c.course_code, l.name AS lecturer_name
      FROM reports r
      JOIN Classes cl ON r.class_id = cl.class_id
      JOIN courses c ON cl.course_id = c.course_id
      JOIN Lecturers l ON cl.lecturer_id = l.lecturer_id
      WHERE cl.prl_id = ?
    `;
    db.query(query, [prl_id], (err, reports) => {
      if (err) {
        console.error('❌ PRL report fetch error:', err.message);
        return res.status(500).json({ error: 'Database error while fetching reports' });
      }
      res.json(reports);
    });
  });
});


router.post('/reports/:id/review', (req, res) => {
  const reportId = req.params.id;
  db.query(
    'UPDATE reports SET status = ? WHERE report_id = ?',
    ['reviewed', reportId],
    (err, result) => {
      if (err) {
        console.error('❌ Review error:', err.message);
        return res.status(500).json({ error: 'Database error during review' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.json({ message: '✅ Report marked as reviewed' });
    }
  );
});


router.get('/pl/reports', (req, res) => {
  db.query("SELECT * FROM reports WHERE status = 'reviewed'", (err, results) => {
    if (err) {
      console.error('❌ PL report fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


router.post('/prl/feedback', (req, res) => {
  const { report_id, feedback } = req.body;
  db.query(
    'INSERT INTO feedbacks (report_id, feedback_text) VALUES (?, ?)',
    [report_id, feedback],
    (err, result) => {
      if (err) {
        console.error('❌ Feedback insert error:', err.message);
        return res.status(500).json({ error: 'Database error during feedback' });
      }
      res.json({ message: '✅ Feedback submitted successfully' });
    }
  );
});


router.post('/submit', (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO reports (
      class_id, week_number, date_of_lecture,
      actual_students_present, topic_taught,
      learning_outcomes, recommendations,
      submitted_by, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.class_id,
    data.week_number,
    data.date_of_lecture,
    data.actual_students_present,
    data.topic_taught,
    data.learning_outcomes,
    data.recommendations,
    data.submitted_by,
    'pending'
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Report submission error:', err.message);
      return res.status(500).json({ error: 'Database error during submission' });
    }
    console.log('✅ Report submitted:', result.insertId);
    res.json({ success: true });
  });
});

module.exports = router;