// Fichier contenant notre logique métier
const Sauce = require('../models/Sauce');
const fs = require('fs');

/**
 * Route POST pour la création d'une sauce - Ajoute une sauce à la base de données.
 *
 * @param   {Object}  req.body                  Object du formulaire.
 * @param   {String}  req.body.userId           Id de l'utlisateur.
 * @param   {String}  req.body.name             Nom de l'utlisateur.
 * @param   {String}  req.body.manufacturer     Fabricant de la sauce.
 * @param   {String}  req.body.description      Description de la sauce.
 * @param   {String}  req.body.mainPepper       Principal ingrédient de la sauce.
 * @param   {String}  req.body.file.filename    Nom de la photo.
 * @param   {Number}  req.body.heat             Force de la sauce.
 * 
 * @returns {void}
 * 
 */

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On génère l'URL de l'image (le protocole, le nom d'hôte et le nom du fichier)
        likes: "0",
        dislikes: "0",
        usersLiked: [`First`],
        usersDisliked: [`First`]
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce ajoutée avec succès !' })) // Message d'alerte
    .catch(error => {
        res.status(400).json({ error })
    });
};

/**
 * Route GET pour la lecture de toutes les sauces - Récupère toutes les infos de toutes les sauces.
 *
 * @return  {JSON}      JSON de toutes les sauces.
 */

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json( sauces ))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Route GET pour la lecture d'une sauce - Récupère toutes les infos d'une seule sauce.
 *
 * @param   {String}  req.params.id     Id de la sauce.
 *
 * @return  {JSON}                      JSON de la sauce demandée.
 */

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //méthode findOne de mongoose afin de récupérer l’objet unique à partir de son id
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/**
 * Route PUT pour la modification d'une sauce - Mettre à jour une sauce.
 *
 * @param   {String}  req.params.id     Id de la sauce.
 * @param   {Object}  req.body          Tous les champs du formulaire.
 * 
 * @returns {void}
 */

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Route DELETE pour la suppression d'une sauce - Supprimer une sauce. /api/sauces/:id
 *
 * @param   {String}  req.params.id   Id de la sauce.
 * 
 * @returns {void}
 */

exports.deleteSauce = (req, res, next) => {
  // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la BDD.
  Sauce.findOne({ _id: req.params.id }) //méthode findOne de mongoose afin de récupérer l’objet à partir de son id.
    .then(sauce => {
      // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
      fs.unlink(`images/${filename}`, () => {
        // On supprime le document correspondant de la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * Like / Dislike une sauce - Route POST pour le like/dislike d'une sauce.
 *
 * @param   {String}  req.params.id   Id de la sauce.
 * @param   {Number}  req.body.like   1 / 0 / -1.
 * @param   {String}  req.body.userId userId de l'utlisateur.
 *
 * @returns {void}
 */

exports.like = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let like = req.body.like;
            let option = {};
            switch(like) {
                case -1:
                    option =
                        {
                            $push : { usersDisliked : req.body.userId },
                            $inc: { dislikes : 1 }
                        };
                    break;
                case 0:
                    for (let userId of sauce.usersDisliked) {
                        if (req.body.userId === userId ) {
                            option = 
                            {
                                $pull : { usersDisliked : userId },
                                $inc : { dislikes : -1 }  
                            };
                        };
                    };
                    for (let userId of sauce.usersLiked) {            
                        if (req.body.userId === userId ) {
                            option =
                            {
                                $pull : { usersLiked : userId },
                                $inc: { likes : -1 }
                            };
                        };
                    };
                    break;
                case 1:
                    option =
                        {   
                            $inc : { likes : 1 },
                            $push : { usersLiked : req.body.userId }
                        };
                    break;
            }
            Sauce.updateOne({ _id: req.params.id }, option)
                .then(() => res.status(200).json({ message: "Objet Liké!" }))      
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}

