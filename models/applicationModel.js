const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An application must have a name'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

applicationSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

applicationSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
