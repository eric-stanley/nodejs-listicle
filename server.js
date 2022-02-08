const mongoose = require('mongoose');
const dotenv = require('dotenv');
const addExceptions = require('./utils/addExceptions');

if (process.env.NODE_ENV === 'production') addExceptions.uncaughtException();

dotenv.config({
  path: './config.env',
});

const app = require('./app');

// const connectionString = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@${process.env.MONGO_ATLAS_SERVER}/${process.env.MONGO_ATLAS_DB}?${process.env.MONGO_ATLAS_QUERY_PARAMS}`;
const connectionString =
  process.env.MONGO_LOCAL_CON_STR + process.env.MONGO_ATLAS_DB;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection successful');
  });

const port = process.env.PORT || 4001;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

if (process.env.NODE_ENV === 'production')
  addExceptions.unhandledRejection(server);
