const mongoose = require('mongoose');
const timeDistance = require('../utils/timeDistance');
const { autoSequenceModelID } = require('./counterModel');

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const teststepSchema = new mongoose.Schema(
  {
    test_step_id: {
      type: Number,
      unique: true,
    },
    test_step_name: {
      type: String,
      required: [true, 'A test step must have a name'],
      trim: true,
    },
    test_case_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Testcase',
    },
    run_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Run',
    },
    expected_result: {
      type: String,
      required: [true, 'A test step must have an expected result'],
      trim: true,
    },
    actual_result: {
      type: String,
      required: [true, 'A test step must have an actual result'],
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
    screenshot_path: {
      type: String,
      trim: true,
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

teststepSchema.virtual('testcases', {
  ref: 'Testcase',
  foreignField: '_id',
  localField: 'test_case_id',
});

teststepSchema.virtual('runs', {
  ref: 'Run',
  foreignField: '_id',
  localField: 'run_id',
});

teststepSchema.virtual('users', {
  ref: 'User',
  foreignField: '_id',
  localField: 'executed_by',
});

teststepSchema.virtual('status', {
  ref: 'Status',
  foreignField: '_id',
  localField: 'status_id',
});

teststepSchema.index({
  test_step_id: 1,
});

teststepSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

teststepSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  await autoSequenceModelID('teststeps', this, 'test_step_id', 1, next);
  next();
});

if (process.env.NODE_ENV === 'development') {
  teststepSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  });
}

const Teststep = mongoose.model('Teststep', teststepSchema);

module.exports = Teststep;
