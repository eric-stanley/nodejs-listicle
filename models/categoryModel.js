const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const categorySchema = new mongoose.Schema(
  {
    category_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
      trim: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    is_active: {
      type: Boolean,
      default: true,
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

categorySchema.index({
  category_id: 1,
});

categorySchema.index({
  project_id: 1,
  owner: 1,
});

categorySchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'owner',
});

categorySchema.virtual('projects', {
  ref: 'Project',
  foreignField: '_id',
  localField: 'project_id',
});

categorySchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

categorySchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('categories', this, 'category_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  categorySchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
