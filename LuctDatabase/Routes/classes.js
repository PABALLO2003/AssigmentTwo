router.get('/lecturer/:id/classes', (req, res) => {
  const lecturerId = req.params.id;

  db.query(
    'SELECT class_id, class_name FROM Classes WHERE lecturer_id = ?',
    [lecturerId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(200).json(results);
    }
  );
});