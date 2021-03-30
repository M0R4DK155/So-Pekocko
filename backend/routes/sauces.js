// Fichier contenant notre logique de routing
const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

// Middleware pour gérer les différentes requêtes et traiter les données associées à ces requêtes.
router.post('/', auth, multer, saucesCtrl.createSauce);     // C // Création d'une sauce et l'enregistre dans la BDD. (d'abord auth, ensuite multer, sinon requete pas authentifiée)
router.post('/:id/like', auth, saucesCtrl.like);            // C // Like ou dislike d'une sauce.
router.get('/', auth, saucesCtrl.getAllSauces);             // R // Renvoie le tableau de toutes les sauces dans la BDD.
router.get('/:id', auth, saucesCtrl.getOneSauce);           // R // Renvoie la sauce avec l'id fourni.
router.put('/:id', auth, multer, saucesCtrl.modifySauce);   // U // Met à jour la sauce avec l'identifiant fourni.
router.delete('/:id', auth, saucesCtrl.deleteSauce);        // D // Supprime la sauce avec l'id fourni.


module.exports = router;