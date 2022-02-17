const dotenv = require('dotenv');
const db = require('./db');
const app = require('./app');

dotenv.config({
  path: './config.env',
});

let server;

const port = process.env.PORT || 4001;

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
