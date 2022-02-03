const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const accessSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
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

accessSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

accessSchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'user_id',
});

accessSchema.virtual('roles', {
  ref: 'Role',
  foreignField: '_id',
  localField: 'role_id',
});

accessSchema.virtual('projects', {
  ref: 'Project',
  foreignField: '_id',
  localField: 'project_id',
});

accessSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('accesses', this, next);
});

accessSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Access = mongoose.model('Access', accessSchema);

module.exports = Access;
