const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const roleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'A role must have a description'],
    unique: true,
    trim: true,
  },
});

roleSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

roleSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
