const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', (req, res) => {
  const { rater_id, ratee_id, role, module_id, rating_value, comments } = req.body;

  console.log('📥 Incoming rating payload:', req.body);

  if (!rater_id || !ratee_id || !role || !rating_value) {
    return res.status(400).json({ error: 'Missing required fields: rater_id, ratee_id, role, rating_value' });
  }

  const raterId = Number(rater_id);
  const rateeId = Number(ratee_id);
  const ratingValue = Number(rating_value);

  if (isNaN(raterId) || isNaN(rateeId) || isNaN(ratingValue)) {
    return res.status(400).json({ error: 'rater_id, ratee_id, and rating_value must be numeric' });
  }

  const query = `
    INSERT INTO Ratings (rater_id, ratee_id, role, module_id, rating_value, comments)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [raterId, rateeId, role, module_id ?? null, ratingValue, comments ?? null],
    (err, result) => {
      if (err) {
        console.error('❌ Rating submission error:', err.code, err.message);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ error: 'Foreign key constraint failed. Ensure rater_id and ratee_id exist in Users table.' });
        }
        return res.status(500).json({ error: 'Database error during rating submission' });
      }
      res.json({ message: '✅ Rating submitted successfully', rating_id: result.insertId });
    }
  );
});


router.get('/', (req, res) => {
  res.status(405).json({ error: 'GET not allowed on /api/ratings. Use POST instead.' });
});


router.get('/pl/ratings', (req, res) => {
  const { lecturer_id, module_id } = req.query;
  let query = 'SELECT * FROM Ratings WHERE 1';
  const params = [];

  if (lecturer_id) {
    query += ' AND ratee_id = ? AND role = "Lecturer"';
    params.push(lecturer_id);
  }

  if (module_id) {
    query += ' AND module_id = ?';
    params.push(module_id);
  }

  query += ' ORDER BY rating_id DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Rating retrieval error:', err.message);
      return res.status(500).json({ error: 'Database error while filtering ratings' });
    }
    res.json(results);
  });
});

module.exports = router;