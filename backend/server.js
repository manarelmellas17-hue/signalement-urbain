const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/signalements', require('./routes/signalements'));
app.use('/api/categories', require('./routes/categories'));

// Test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur Signalement Urbain en marche ✅' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});