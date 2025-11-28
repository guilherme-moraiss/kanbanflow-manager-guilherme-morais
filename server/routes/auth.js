const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios' });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const { password: _, ...safeUser } = user;
    res.json({
      token: 'fake-jwt-token-' + Date.now(),
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

