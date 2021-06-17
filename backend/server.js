require("dotenv").config();

const http = require('http'); //On importe le package HTTP de Node.
const app = require('./app');

// la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne.
const normalizePort = val => {
  const port = parseInt(val, 10); //analyse de l'argument passé, valeur obtenue assigné à une constante "port"

  if (isNaN(port)) { // si la constante "port" n'est pas un Nombre (isNaN)
    return val; // renvoie de l'argument qui passé à la fonction
  }
  if (port >= 0) {
    return port; // si la valeur de la constante "port" est supérieur à zéro de donc valide: la fonction renvoie la constante "port".
  }
  return false; // sinon (port<0) la fonction renvoie alors false.
};

const port = normalizePort(process.env.PORT || '3000'); //si process.env.PORT n'est pas disponible alors on se sert du port 3000.
app.set('port', port);

// Management des erreurs - La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur.
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES': // EACCES :  permission denied
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE': //EADDRINUSE: port already in use
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); //createServer = méthode http de Node qui permet de créer un serveur.

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
