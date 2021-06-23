const express = require('express');         // On importe Express avec la commande require.
const mongoose = require('mongoose');       // On importe Mongoose.
const cors = require('cors');               // On importe Cors.
const path = require('path');               // On importe le paquet node "path" qui donne accès au chemin du système de fichier.
const helmet = require('helmet');           // On sécurise (un peu plus) l'appli avec.

// Import des routes pour l'utilisateur et les sauces depuis le répertoire "routes".
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

//On appelle la méthode express qui nous permet de créer une appli express.
const app = express(); 

// Sécurisation des headers
app.use(helmet());

// Connexion à la BDD MongoDB - Pour se connecter, mongoose va aller chercher le code dans le fichie .env
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.awfya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Active CORS pour éviter les attaques CSRF - sécurisation cors: origin localhost:4200
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Logique gestion CORS - Premier middleware général exécuté par notre serveur. Sans route spécifique, il sera appliqué à toutes les routes, à toutes les requêtes envoyées au serveur.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Middleware pour traiter les données (en POST) envoyées.
app.use(express.json()); 

// Middleware spécifique pour gérer les images.
app.use('/images', express.static(path.join(__dirname, 'images'))); // indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images .

// Routes API
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//On exporte la constante app pour qu'on puisse y accéder depuis les autres fichiers de notre projet, notamment notre serveur Node.
module.exports = app; 

