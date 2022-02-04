const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const userRoleSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Please provide a valid role id'],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a valid user id'],
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

userRoleSchema.virtual('roles', {
  ref: 'Role',
  foreignField: '_id',
  localField: 'role_id',
});

userRoleSchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'user_id',
});

userRoleSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

userRoleSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('userroles', this, next);
});

userRoleSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
