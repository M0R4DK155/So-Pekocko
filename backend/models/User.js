const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma de donnée pour un utilisateur
const userSchema = mongoose.Schema({
    email:      { type: String, required: true, unique: true }, // On stocke l'adresse électronique dans la base de données comme unique.
    password:   { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);