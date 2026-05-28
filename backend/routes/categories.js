const express = require('express');
const router = express.Router();
const { db } = require('../config/couchdb');

const categoriesDefaut = [
  { _id: 'cat_eclairage',  nom: 'Éclairage public défectueux', icone: '💡', value: 'eclairage' },
  { _id: 'cat_route',      nom: 'Route / trottoir endommagé',  icone: '🛣️', value: 'route' },
  { _id: 'cat_dechets',    nom: 'Dépôt sauvage de déchets',    icone: '🗑️', value: 'dechets' },
  { _id: 'cat_vandalisme', nom: 'Vandalisme / dégradation',    icone: '🔨', value: 'vandalisme' },
  { _id: 'cat_inondation', nom: 'Inondation / eau stagnante',  icone: '🌊', value: 'inondation' },
  { _id: 'cat_autre',      nom: 'Autre',                       icone: '📌', value: 'autre' }
];

// Obtenir toutes les catégories
router.get('/', async (req, res) => {
  try {
    const result = await db.categories.list({ include_docs: true });
    let cats = result.rows.map(r => r.doc).filter(d => !d._id.startsWith('_'));
    if (cats.length === 0) {
      // Insérer les catégories par défaut si vide
      for (const cat of categoriesDefaut) {
        await db.categories.insert(cat);
      }
      cats = categoriesDefaut;
    }
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;