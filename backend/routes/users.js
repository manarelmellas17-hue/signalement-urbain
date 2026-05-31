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
      statut: 'actif',
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
      if (user.statut === 'suspendu') {
        return res.status(403).json({ error: 'Compte suspendu. Contactez un administrateur.' });
      }
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN : Lister tous les utilisateurs ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await db.utilisateurs.list({ include_docs: true });
    const users = result.rows.map(r => r.doc).filter(u => u.type === 'utilisateur');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN : Obtenir un utilisateur par ID ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = await db.utilisateurs.get(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN : Modifier un utilisateur (rôle, statut, infos) ────────────────────
router.put('/:id', async (req, res) => {
  try {
    const doc = await db.utilisateurs.get(req.params.id);
    const { nom, email, role, statut, motdepasse } = req.body;
    const updated = {
      ...doc,
      nom: nom !== undefined ? nom : doc.nom,
      email: email !== undefined ? email : doc.email,
      role: role !== undefined ? role : doc.role,
      statut: statut !== undefined ? statut : doc.statut,
      motdepasse: motdepasse !== undefined ? motdepasse : doc.motdepasse,
      date_modification: new Date().toISOString()
    };
    const result = await db.utilisateurs.insert(updated);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN : Supprimer un utilisateur ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const doc = await db.utilisateurs.get(req.params.id);
    await db.utilisateurs.destroy(doc._id, doc._rev);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
