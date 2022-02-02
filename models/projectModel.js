const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const projectSchema = new mongoose.Schema(
  {
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
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

projectSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

projectSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
