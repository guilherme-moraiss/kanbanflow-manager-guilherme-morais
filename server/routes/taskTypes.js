const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  db.all('SELECT * FROM TaskTypes', (err, types) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(types);
  });
});

router.post('/', (req, res) => {
  const { name, color } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO TaskTypes (id, name, color) VALUES (?, ?, ?)',
    [id, name, color],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get('SELECT * FROM TaskTypes WHERE id = ?', [id], (err, type) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(type);
      });
    }
  );
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (color) {
    updates.push('color = ?');
    values.push(color);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);

  db.run(
    `UPDATE TaskTypes SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Task type not found' });

      db.get('SELECT * FROM TaskTypes WHERE id = ?', [id], (err, type) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(type);
      });
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM TaskTypes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Task type not found' });
    res.status(204).send();
  });
});

module.exports = router;

