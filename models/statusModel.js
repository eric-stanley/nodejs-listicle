const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const statusSchema = new mongoose.Schema({
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

statusSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
