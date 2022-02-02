const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const groupSchema = new mongoose.Schema({
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

groupSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
