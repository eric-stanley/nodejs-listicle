const mongoose = require('mongoose');
const timeDistance = require('../utils/timeDistance');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const runSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A run must have a name'],
      unique: true,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

runSchema.virtual('duration').get(function () {
  return timeDistance(this._doc.updated_at, this._doc.created_at);
});

runSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

runSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Run = mongoose.model('Run', runSchema);

module.exports = Run;
