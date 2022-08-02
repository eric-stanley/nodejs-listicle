const dotenv = require('dotenv');
const db = require('./db');
const app = require('./app');

dotenv.config({
  path: './config.env',
});

let server, port;

switch (process.env.NODE_ENV) {
  case 'development':
    port = process.env.DEV_PORT || 4001;
    break;
  case 'test':
    port = process.env.TEST_PORT || 4011;
    break;
  case 'production':
    port = process.env.PROD_PORT || 4021;
    break;
}

exports.startServer = async () => {
  await db.connect();
  server = await app.listen(port);
  app.emit('appStarted');
  return server;
};

exports.stopServer = async () => {
  await db.disconnect();
  server = await server.close();
  app.emit('appStopped');
  return server;
};
