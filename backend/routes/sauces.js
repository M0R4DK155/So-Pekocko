// Fichier contenant notre logique de routing
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const saucesCtrl = require('../controllers/sauces');


// C // Route pour ajouter une sauce - Création d'une sauce et l'enregistre dans la BDD. (d'abord auth, ensuite multer, sinon requête pas authentifiée)
router.post('/', auth, multer, saucesCtrl.createSauce);

// C // Route pour liker ou disliker une sauce - Like/dislike d'une sauce.
router.post('/:id/like', auth, saucesCtrl.like);            

// R // Route pour récupérer toutes les sauces - Renvoie le tableau de toutes les sauces dans la BDD.
router.get('/', auth, saucesCtrl.getAllSauces);             

// R // Route pour récupérer une sauce spécifique - Renvoie la sauce avec l'id fourni.
router.get('/:id', auth, saucesCtrl.getOneSauce);           

// U // Route pour modifier une sauce spécifique - Modification d'une sauce avec l'identifiant fourni.
router.put('/:id', auth, multer, saucesCtrl.modifySauce);   

// D // Route pour supprimer une sauce spécifique - Supprime la sauce avec l'id fourni.
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);        


module.exports = router;