const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'A user must have a username'],
      unique: true,
      trim: true,
      maxlength: [25, 'Username must have less than or equal to 25 characters'],
      minlength: [5, 'Username must have more than or equal to 6 characters'],
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      maxlength: [40, 'Password must have less than or equal to 40 characters'],
      minlength: [8, 'Password must have more than or equal to 8 characters'],
      select: false,
    },
    password_confirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // Only works on create and save
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
      lowercase: true,
    },
    slug: {
      type: String,
      lower: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      select: false,
    },
    password_changed_at: {
      type: Date,
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: Date,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.password_confirm;
        return ret;
      },
    },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

userSchema.index({
  user_id: 1,
});

userSchema.index({
  username: 1,
});

userSchema.index({
  email: 1,
});

userSchema.index({
  slug: 1,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.password_confirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password_changed_at = Date.now() - 1000;
  next();
});

userSchema.pre('save', function (next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('users', this, 'user_id', 1, next);
  next();
});

userSchema.pre(/^find/, function (next) {
  // this point to the current query
  this.start = Date.now();
  next();
});

if (process.env.NODE_ENV === 'development') {
  userSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
