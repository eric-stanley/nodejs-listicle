const addExceptions = require('./utils/addExceptions');

if (process.env.NODE_ENV === 'production') {
  addExceptions.uncaughtException();
}

const listener = require('./listener');

const server = listener.startServer();

if (process.env.NODE_ENV === 'production') {
  addExceptions.unhandledRejection(server);
}
