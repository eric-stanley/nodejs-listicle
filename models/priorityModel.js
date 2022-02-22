const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const prioritySchema = new mongoose.Schema({
  priority_id: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A priority must have a description'],
    unique: true,
    trim: true,
  },
});

prioritySchema.index({
  priority_id: 1,
});

prioritySchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

prioritySchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('priorities', this, 'priority_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  prioritySchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Priority = mongoose.model('Priority', prioritySchema);

module.exports = Priority;
