const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios' });
  }

  db.get(
    'SELECT * FROM Users WHERE username = ? AND password = ?',
    [username, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

      const { password: _, ...safeUser } = user;
      res.json({
        token: 'fake-jwt-token-' + Date.now(),
        user: safeUser
      });
    }
  );
});

module.exports = router;

