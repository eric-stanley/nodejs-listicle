const mongoose = require('mongoose');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const testcaseSchema = new mongoose.Schema(
  {
    test_case_id: {
      type: Number,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A testcase must have a description'],
      trim: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    priority_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Priority',
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    app_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    env_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Environment',
    },
    test_case_name: {
      type: String,
      required: [true, 'A testcase must have a name'],
      trim: true,
    },
    executed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    executed_on: {
      type: Date,
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Status',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

testcaseSchema.virtual('projects', {
  ref: 'Project',
  foreignField: '_id',
  localField: 'project_id',
});

testcaseSchema.virtual('priorities', {
  ref: 'Priority',
  foreignField: '_id',
  localField: 'priority_id',
});

testcaseSchema.virtual('groups', {
  ref: 'Group',
  foreignField: '_id',
  localField: 'group_id',
});

testcaseSchema.virtual('categories', {
  ref: 'Category',
  foreignField: '_id',
  localField: 'category_id',
});

testcaseSchema.virtual('applications', {
  ref: 'Application',
  foreignField: '_id',
  localField: 'app_id',
});

testcaseSchema.virtual('environments', {
  ref: 'Environment',
  foreignField: '_id',
  localField: 'env_id',
});

testcaseSchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'executed_by',
});

testcaseSchema.virtual('status', {
  ref: 'Status',
  foreignField: '_id',
  localField: 'status_id',
});

testcaseSchema.index({
  test_case_id: 1,
});

testcaseSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

testcaseSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('testcases', this, 'test_case_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  testcaseSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Testcase = mongoose.model('Testcase', testcaseSchema);

module.exports = Testcase;
