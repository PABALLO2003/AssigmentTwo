const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', (req, res) => {
  db.query('SELECT venue_id, venue_name FROM venues', (err, results) => {
    if (err) {
      console.error('❌ Venue fetch error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!results || results.length === 0) {
      console.warn('⚠️ No venues found.');
      return res.status(404).json({ error: 'No venues available' });
    }

    console.log(`✅ ${results.length} venues fetched`);
    res.json(results);
  });
});

module.exports = router;