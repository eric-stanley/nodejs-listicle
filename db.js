const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

let connectionString, conn;

switch (process.env.NODE_ENV) {
  case 'production':
    connectionString =
      process.env.MONGO_LOCAL_CON_STR + process.env.MONGO_ATLAS_DB_PROD;
    break;
  case 'development':
    connectionString =
      process.env.MONGO_LOCAL_CON_STR + process.env.MONGO_ATLAS_DB_DEV;
    break;
  case 'test':
    connectionString =
      process.env.MONGO_LOCAL_CON_STR + process.env.MONGO_ATLAS_DB_TEST;
    break;
}

exports.connect = async () => {
  conn = await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (process.env.NODE_ENV === 'development') {
    if (conn) {
      console.log('Database connected');
      return conn;
    } else {
      console.log('Database not connected');
      return conn;
    }
  }
};

exports.disconnect = async () => {
  conn = await mongoose.connection.close();

  if (process.env.NODE_ENV === 'development') {
    if (!conn) {
      console.log('Database disconnected');
      return conn;
    } else {
      console.log('Database not disconnected');
      return conn;
    }
  }
};
