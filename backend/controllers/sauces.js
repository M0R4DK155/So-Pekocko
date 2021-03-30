// Fichier contenant notre logique métier
const Sauce = require('../models/Sauce');

// Route POST pour la création d'une sauce.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On génère l'URL de l'image (le protocole, le nom d'hôte et le nom du fichier)
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

// Route PUT pour la modification d'une sauce.
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

// Route DELETE pour la suppression d'une sauce.
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })                                                   // On va d'abord trouver l'objet dans la BDD
        .then(sauce => {                                                                    // Quand on le trouve
            const filename = sauce.imageUrl.split('/images/')[1];                           // On extrait le nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => {                                         // Avec ce nom de fichier, on le supprime avec fs.unlink
                Sauce.deleteOne({ _id: req.params.id })                                     // Dans le callback () de fs.unlink, donc une fois la suppression du fichier effectué, on supprime l'objet de la BDD. 
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Route POST pour le like/dislike d'une sauce.
exports.like = (req, res, next) => {
    switch(req.body.like) {
        // L'utilisateur aime la sauce on incrémente les likes et on ajoute l'utilisateur au tableau usersLiked
    case 1:
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: {likes: 1},
            $push: { usersLiked: req.body.userId },
            _id: req.params.id
        })
        .then( sauce => { res.status(201).json({ message: `Vous aimez la sauce ${sauce.name}` }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    break;
        // L'utilisateur n'aime pas la sauce on incrémente les dislikes et on ajoute au tableau userDisliked
    case -1:
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: {dislikes: 1},
            $push: { usersDisliked: req.body.userId },
            _id: req.params.id
        })
        .then( sauce => { res.status(201).json({ message: `Vous n'aimez pas la sauce ${sauce.name}` }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    break;

        //On verifie le précédent choix de l'User et remet à 0 
    case 0:
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const userLike = sauce.usersLiked.filter(ArrayUserLiked => req.body.userId);
            const userDislike = sauce.usersDisliked.filter(ArrayUserLiked => req.body.userId);
            if (userLike.length != null ){
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: {likes: -1},
                    $pull: { usersLiked: req.body.userId },
                    _id: req.params.id
                })
                .then( sauce => { res.status(201).json({ message: `Vous n'aimez plus la sauce ${sauce.name}` }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            }
            else if (userDislike.length != null){
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: {dislikes: -1},
                    $pull: { usersDisliked: req.body.userId },
                    _id: req.params.id
                })
                .then( sauce => { res.status(201).json({ message: `Vous commencez à aimer la sauce ${sauce.name}` }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            };
            
        })
        .catch(error => res.status(400).json({ error }))
        
    }
}

// Route GET pour la lecture d'une sauce.
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Route GET pour la lecture de toutes les sauces.
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};






