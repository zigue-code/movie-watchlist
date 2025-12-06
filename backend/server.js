const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
// Middleware pour de communication entre backend et frontend
app.use(cors());
app.use(express.json());
 // importer les routes des films
// Routes pour les films
const movieRoutes = require('./routes/movies');
// Monter les routes sous /api/movies pour correspondre au frontend
app.use('/api/movies', movieRoutes);


 // Afficher (masqué) la valeur utilisée pour le test de connexion
if (process.env.MONGODB_URI) {
  const masked = process.env.MONGODB_URI.replace(/:[^:@]+@/, ':*****@');
  console.log('ℹ️ MONGODB_URI used (masked):', masked);
} else {
  console.log('⚠️ MONGODB_URI n\'est pas défini dans les variables d\'environnement.');
}
// Connexion MongoDB (gratuit sur MongoDB Atlas)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviedb')
  .then(() => console.log('✅ MongoDB connecté pour les films!'))
  .catch(err => console.log('❌ Erreur:', err));


// Routes API
app.get('/', (req, res) => {
    res.json('Bienvenue sur l\'API de la watchlist de films!');
});

// lancer le serveur 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});