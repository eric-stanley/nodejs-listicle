const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const projectSchema = new mongoose.Schema(
  {
    project_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'A project must have a name'],
      unique: true,
      trim: true,
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

projectSchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'owner',
});

projectSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

projectSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('projects', this, 'project_id', 1, next);
  next();
});

projectSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
