const mongoose = require('mongoose');
const flushPromises = require('flush-promises');

const db = require('../db');
const seed = require('../data/seed-initial-data');

mongoose.promise = global.Promise;

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function removeCollections() {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.drop();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running'))
        return;
      console.log(error.message);
    }
  }
}

module.exports = {
  setupDB() {
    // Connect to Mongoose
    beforeAll(async () => {
      await db.connect();
      await dropAllCollections();
      await seed.importData();
    });

    afterEach(async () => {
      await flushPromises();
    });

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    });
  },
};
