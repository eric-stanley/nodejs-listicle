const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const categorySchema = new mongoose.Schema(
  {
    id: {
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
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

categorySchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'owner',
});

categorySchema.virtual('users', {
  ref: 'Project',
  foreignField: '_id',
  localField: 'project_id',
});

categorySchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

categorySchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('categories', this, next);
});

categorySchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
