const nano = require('nano')('http://admin:admin@localhost:5984');

const db = {
  signalements: nano.use('signalements'),
  utilisateurs: nano.use('utilisateurs'),
  categories: nano.use('categories'),
  commentaires: nano.use('commentaires')
};

module.exports = { nano, db };