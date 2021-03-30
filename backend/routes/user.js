const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);    // Chiffre le MDP de l'utilisateur, ajoute l'utilisateur à la BDD.
router.post('/login', userCtrl.login);      // Vérifie les informations d'identification de l'utilisateur en renvoyant l'identifiant userId depuis la BDD et un jeton web JSON signé (contenant également l'identifiant userId)



module.exports = router;