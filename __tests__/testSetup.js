const mongoose = require('mongoose');
const flushPromises = require('flush-promises');

const db = require('../db');
const seed = require('../data/seed-initial-data');

mongoose.promise = global.Promise;

async function clearCollections() {
  const collections = Object.keys(mongoose.connection.collections);

  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    while (true) {
      await collection.deleteMany({});
      const count = await collection.countDocuments({});
      if (count === 0) {
        break;
      }
    }
  }
}

async function dropDatabase() {
  await mongoose.connection.db.dropDatabase();
}

async function dropAllCollectionsAndIndexes() {
  let collections;
  collections = Object.keys(mongoose.connection.collections);

  while (true) {
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      try {
        await collection.dropIndexes();
        await collection.drop();
      } catch (error) {
        // Sometimes this error happens, but you can safely ignore it
        if (error.message.includes('ns not found')) return;
        // This error occurs when you use it.todo. You can
        // safely ignore this error too
        if (
          error.message.includes('a background operation is currently running')
        )
          return;
        console.log(error.message);
      }
    }
    collections = Object.keys(mongoose.connection.collections);

    if (collections.length === 0) {
      console.log('all collections dropped');
      break;
    }
  }
}

module.exports = {
  setupDB() {
    // Connect to Mongoose
    beforeAll(async () => {
      await db.connect();
      await clearCollections();
      await seed.importData();
    });

    beforeEach(() => {
      // ensure there's at least one assertion run for every test
      expect.hasAssertions();
    });

    afterEach(async () => {
      // flush all pending promises before each test
      await flushPromises();
    });

    // Disconnect Mongoose
    afterAll(async () => {
      await clearCollections();
      await mongoose.connection.close();
    });
  },
};
