// Import des modules et fichiers complémentaires
const bcrypt = require('bcrypt'); // bibliothèque permettant de hacher les mots de passe.
const jwt = require('jsonwebtoken'); // Permet de créer et vérifier des tokens d'authentification.

const User = require('../models/User');

// Middlewares d'authentification.
/**
 * Enregistrement de l'utilisateur /api/auth/signup.
 *
 * @param   {Object}  req.body              Champs du formulaire.
 * @param   {String}  req.body.email        Email de l'utilisateur.
 * @param   {String}  req.body.password     Mot de passe de l'utilisateur.
 *
 */

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: mask(req.body.email),
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * Connecter un utilisateur - Route login /api/auth/login
 *
 * @param   {Object}  req.body   Champs du formulaire.
 * @param   {String}  req.body.email   Email de l'utilisateur.
 * @param   {String}  req.body.password  Mot de passe de l'utilisateur.
 * 
 */

exports.login = (req, res, next) => {
  User.findOne({ email: mask(req.body.email) })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( // On utilise la fonction sign de jwt pour encoder un token.
              { userId: user._id },
              process.env.SECRET,
              { expiresIn: '24h' } // Durée de validité du token.
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * [Masquage/Hashage de l'email]
 * @param   {string}    email   Email de l'utilisateur.
 * @param   {boolean}   reveal  Sur false par défaut.
 * 
 * @return  {String}            Adresse Email masquée.
 */

function mask(email, reveal=false){
    let newMail = "";
    let code;
    let arobase = false;
    for (let i=0, size = email.length;i<size; i++){
        if (email[i] === "@"){
            arobase = true;
            newMail+="@";
            continue;
        }
        if (arobase && email[i] === "."){
            newMail+=email.slice(i);
            break;
        }
        if (reveal) code = email.charCodeAt(i)-1;
        else code = email.charCodeAt(i)+1;

        newMail +=String.fromCharCode(code);
    }
    return newMail;
}
