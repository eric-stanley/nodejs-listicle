const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
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

categorySchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

categorySchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
