const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const prioritySchema = new mongoose.Schema({
  id: {
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

prioritySchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

prioritySchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('priorities', this, next);
});

prioritySchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Priority = mongoose.model('Priority', prioritySchema);

module.exports = Priority;
