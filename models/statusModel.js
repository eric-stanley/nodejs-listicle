const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const statusSchema = new mongoose.Schema({
  id: {
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

statusSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('status', this, next);
});

statusSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
