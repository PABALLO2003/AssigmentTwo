const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/courses', (req, res) => {
  const user_id = req.query.user_id;

  db.query('SELECT prl_id FROM PRL WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      console.error('❌ PRL course fetch error:', err);
      return res.status(500).json({ error: 'Database error while fetching PRL ID' });
    }
    if (!rows.length) return res.status(404).json({ error: 'PRL not found' });

    const prl_id = rows[0].prl_id;

    db.query(
      `SELECT DISTINCT c.*
       FROM Classes cl
       JOIN courses c ON cl.course_id = c.course_id
       WHERE cl.prl_id = ?`,
      [prl_id],
      (err, courses) => {
        if (err) {
          console.error('❌ PRL course fetch error:', err);
          return res.status(500).json({ error: 'Database error while fetching courses' });
        }
        res.json(courses);
      }
    );
  });
});


router.get('/classes', (req, res) => {
  const user_id = req.query.user_id;

  db.query('SELECT prl_id FROM PRL WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      console.error('❌ PRL class fetch error:', err);
      return res.status(500).json({ error: 'Database error while fetching PRL ID' });
    }
    if (!rows.length) return res.status(404).json({ error: 'PRL not found' });

    const prl_id = rows[0].prl_id;

    db.query('SELECT * FROM Classes WHERE prl_id = ?', [prl_id], (err, classes) => {
      if (err) {
        console.error('❌ PRL class fetch error:', err);
        return res.status(500).json({ error: 'Database error while fetching classes' });
      }
      res.json(classes);
    });
  });
});


router.get('/monitoring', (req, res) => {
  const user_id = req.query.user_id;

  db.query('SELECT prl_id FROM PRL WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      console.error('❌ PRL monitoring fetch error:', err);
      return res.status(500).json({ error: 'Database error while fetching PRL ID' });
    }
    if (!rows.length) return res.status(404).json({ error: 'PRL not found' });

    const prl_id = rows[0].prl_id;

    db.query('SELECT * FROM Monitoring WHERE prl_id = ?', [prl_id], (err, monitoring) => {
      if (err) {
        console.error('❌ PRL monitoring fetch error:', err);
        return res.status(500).json({ error: 'Database error while fetching monitoring records' });
      }
      res.json(monitoring);
    });
  });
});


router.get('/ratings', (req, res) => {
  const user_id = req.query.user_id;

  db.query('SELECT prl_id FROM PRL WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      console.error('❌ PRL ratings fetch error:', err);
      return res.status(500).json({ error: 'Database error while fetching PRL ID' });
    }
    if (!rows.length) return res.status(404).json({ error: 'PRL not found' });

    const prl_id = rows[0].prl_id;

    db.query('SELECT * FROM Ratings WHERE prl_id = ?', [prl_id], (err, ratings) => {
      if (err) {
        console.error('❌ PRL ratings fetch error:', err);
        return res.status(500).json({ error: 'Database error while fetching ratings' });
      }
      res.json(ratings);
    });
  });
});


router.get('/reports', (req, res) => {
  const user_id = req.query.user_id;

  db.query('SELECT prl_id FROM PRL WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      console.error('❌ PRL report fetch error:', err);
      return res.status(500).json({ error: 'Database error while fetching PRL ID' });
    }
    if (!rows.length) return res.status(404).json({ error: 'PRL not found' });

    const prl_id = rows[0].prl_id;

    db.query(
      `SELECT r.*, c.course_name, c.course_code, l.name AS lecturer_name
       FROM reports r
       JOIN Classes cl ON r.class_id = cl.class_id
       JOIN courses c ON cl.course_id = c.course_id
       JOIN Lecturers l ON cl.lecturer_id = l.lecturer_id
       WHERE cl.prl_id = ?`,
      [prl_id],
      (err, reports) => {
        if (err) {
          console.error('❌ PRL report fetch error:', err);
          return res.status(500).json({ error: 'Database error while fetching reports' });
        }
        res.json(reports);
      }
    );
  });
});

module.exports = router;