const mongoose = require('mongoose'); // La méthode require permet d'appeler l'utilisation de mongoose.

// Schéma de données qui contient les champs souhaités pour chaque sauce.
const sauceSchema = mongoose.Schema({
  id:           { type: Object, required: false },              // Identifiant unique créé par MongoDB.
  userId:       { type: String, required: true },               // Identifiant unique MongoDB pour l'utilisateur qui a créé la sauce.
  name:         { type: String, required: true },               // Nom de la sauce.
  manufacturer: { type: String, required: true },               // Fabricant de la sauce.
  description:  { type: String, required: true },               // Description de la sauce.
  mainPepper:   { type: String, required: true },               // Ingrédient principal de la sauce.
  imageUrl:     { type: String, required: true },               // String de l'image de la sauce téléchargée par l'utilisateur.
  heat:         { type: Number, required: true },               // Nombre entre 1 et 10 décrivant la sauce.
  likes:        { type: Number, required: false, default: 0 },  // Nombre d'utilisateurs qui aiment la sauce.
  dislikes:     { type: Number, required: false, default: 0 },  // Nombre d'utilisateurs qui n'aiment pas la sauce.
  usersLiked:   { type: [String], required: false },            // Tableau d'identifiants d'utilisateurs ayant aimé la sauce.
  usersDisliked:{ type: [String], required: false },            // Tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce.
});

// Le 1er argument passé à model est le nom du modèle, et le 2ème argument est le schéma que nous allons utiliser.
module.exports = mongoose.model('Sauce', sauceSchema); 