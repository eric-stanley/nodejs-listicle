const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const statusSchema = new mongoose.Schema({
  status_id: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A status must have a description'],
    unique: true,
    trim: true,
  },
});

statusSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

statusSchema.index({
  status_id: 1,
});

statusSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('status', this, 'status_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  statusSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
