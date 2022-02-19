const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const groupSchema = new mongoose.Schema({
  group_id: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A group must have a description'],
    unique: true,
    trim: true,
  },
});

groupSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

groupSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('groups', this, 'group_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  groupSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
