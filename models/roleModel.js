const mongoose = require('mongoose');
const counterModel = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const roleSchema = new mongoose.Schema({
  role_id: {
    type: Number,
    unique: true,
  },
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

roleSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await counterModel.autoSequenceModelID('roles', this, 'role_id', 1, next);
  next();
});

roleSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
