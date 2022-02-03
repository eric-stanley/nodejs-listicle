const mongoose = require('mongoose');
const { autoIncrementModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const environmentSchema = new mongoose.Schema({
  id: {
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

environmentSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

environmentSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('environments', this, next);
});

environmentSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Environment = mongoose.model('Environment', environmentSchema);

module.exports = Environment;
