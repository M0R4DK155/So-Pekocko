const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); 

// Schéma de données qui contient les champs souhaités pour chaque utilisateur (l'Id est automatiquement généré par Mongoose).
const userSchema = mongoose.Schema({
    email:      { type: String, required: true, unique: true }, // On stocke l'adresse électronique dans la base de données comme unique. (empeche l'utilisation d'un email plusieurs fois).
    password:   { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); // Nous exportons ce schéma en tant que modèle Mongoose appelé « User », le rendant par là même disponible pour notre application Express.