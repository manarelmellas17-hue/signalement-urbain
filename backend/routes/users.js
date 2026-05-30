const express = require('express');
const router = express.Router();
const { db } = require('../config/couchdb');

// Inscription
router.post('/register', async (req, res) => {
  const { nom, email, motdepasse, role } = req.body;
  try {
    const user = {
      type: 'utilisateur',
      nom,
      email,
      motdepasse,
      role: role || 'citoyen',
      date_inscription: new Date().toISOString(),
      signalements_soumis: 0
    };
    const result = await db.utilisateurs.insert(user);
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, motdepasse } = req.body;
  try {
    const result = await db.utilisateurs.list({ include_docs: true });
    const user = result.rows
      .map(r => r.doc)
      .find(u => u.email === email && u.motdepasse === motdepasse);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;