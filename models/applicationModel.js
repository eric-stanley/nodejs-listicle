const mongoose = require('mongoose');
const counterModel = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const applicationSchema = new mongoose.Schema(
  {
    app_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'An application must have a name'],
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

applicationSchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'owner',
});

applicationSchema.virtual('projects', {
  ref: 'Project',
  foreignField: '_id',
  localField: 'project_id',
});

applicationSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

applicationSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await counterModel.autoSequenceModelID(
    'applications',
    this,
    'app_id',
    1,
    next
  );
  next();
});

applicationSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
