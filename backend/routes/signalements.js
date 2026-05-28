const express = require('express');
const router = express.Router();
const { db } = require('../config/couchdb');

// Obtenir tous les signalements
router.get('/', async (req, res) => {
  try {
    const result = await db.signalements.list({ include_docs: true });
    const docs = result.rows.map(r => r.doc);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un signalement
router.post('/', async (req, res) => {
  try {
    const signalement = {
      type: 'signalement',
      ...req.body,
      statut: 'en_attente',
      votes: 0,
      date_creation: new Date().toISOString(),
      historique: [{
        statut: 'en_attente',
        date: new Date().toISOString(),
        commentaire: 'Signalement soumis'
      }]
    };
    const result = await db.signalements.insert(signalement);
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier le statut d'un signalement
router.put('/:id', async (req, res) => {
  try {
    const doc = await db.signalements.get(req.params.id);
    const updated = {
      ...doc,
      statut: req.body.statut,
      historique: [...doc.historique, {
        statut: req.body.statut,
        date: new Date().toISOString(),
        commentaire: req.body.commentaire || ''
      }]
    };
    const result = await db.signalements.insert(updated);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un signalement
router.delete('/:id', async (req, res) => {
  try {
    const doc = await db.signalements.get(req.params.id);
    await db.signalements.destroy(doc._id, doc._rev);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;