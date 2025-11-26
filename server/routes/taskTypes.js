const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM TaskTypes', (err, types) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(types);
  });
});

module.exports = router;

