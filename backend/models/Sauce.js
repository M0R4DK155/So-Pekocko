const mongoose = require('mongoose'); // La méthode require permet d'appeler l'utilisation de mongoose.

//Schéma de donnée pour une sauce
const sauceSchema = mongoose.Schema({
  id:           { type: Object, required: true },
  userId:       { type: String, required: true },
  name:         { type: String, required: true },
  manufacturer: { type: String, required: true },
  description:  { type: String, required: true },
  mainPepper:   { type: String, required: true },
  imageUrl:     { type: String, required: true },
  heat:         { type: Number, required: true },
  likes:        { type: Number, required: false, default: 0 },
  dislikes:     { type: Number, required: false, default: 0 },
  usersLiked:   { type: String, required: false, default: 0 },
  usersDisliked:{ type: String, required: false, default: 0 },
});

//Le 1er argument passé à model est le nom du modèle, et le 2ème argument est le schéma que nous allons utilisé.
module.exports = mongoose.model('Sauce', sauceSchema); 