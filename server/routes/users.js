const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  db.all('SELECT id, name, username, role, experienceLevel, department, managerId, avatarUrl FROM Users', (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

router.post('/', (req, res) => {
  const { name, username, password, role, experienceLevel, department, managerId } = req.body;

  db.get('SELECT id FROM Users WHERE username = ?', [username], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) return res.status(400).json({ error: 'Username já existe' });

    const id = uuidv4();

    db.run(
      'INSERT INTO Users (id, name, username, password, role, experienceLevel, department, managerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, username, password, role, experienceLevel, department, managerId || null],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get('SELECT id, name, username, role, experienceLevel, department, managerId, avatarUrl FROM Users WHERE id = ?', [id], (err, user) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(user);
        });
      }
    );
  });
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const allowedFields = ['name', 'username', 'password', 'role', 'experienceLevel', 'department', 'managerId', 'avatarUrl'];
  const fields = Object.keys(updates).filter(key => allowedFields.includes(key));

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = [...fields.map(field => updates[field]), id];

  db.run(`UPDATE Users SET ${setClause} WHERE id = ?`, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    db.get('SELECT id, name, username, role, experienceLevel, department, managerId, avatarUrl FROM Users WHERE id = ?', [id], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(user);
    });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM Users WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(204).send();
  });
});

module.exports = router;

