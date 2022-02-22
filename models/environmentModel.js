const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const environmentSchema = new mongoose.Schema({
  env_id: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'An environment must have a description'],
    unique: true,
    trim: true,
  },
});

environmentSchema.index({
  env_id: 1,
});

environmentSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

environmentSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('environments', this, 'env_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  environmentSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Environment = mongoose.model('Environment', environmentSchema);

module.exports = Environment;
