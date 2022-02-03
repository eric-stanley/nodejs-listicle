const Run = require('../models/runModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { autoDecrementModelID } = require('../models/counterModel');

exports.getAllRuns = catchAsync(async (req, res) => {
  const defaultField = 'name';
  const defaultPage = 1;
  const defaultLimit = 10;

  // Execute query
  const features = new APIFeatures(
    Run.find(),
    req.body,
    defaultField,
    defaultPage,
    defaultLimit
  )
    .filter()
    .sort()
    .select()
    .paginate();
  const runs = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: runs.length,
    data: {
      runs,
    },
  });
});

exports.getRun = catchAsync(async (req, res, next) => {
  const run = await Run.findById(req.params.id);

  if (!run) {
    return next(new AppError('No run found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      run,
    },
  });
});

exports.createRun = catchAsync(async (req, res, next) => {
  let run;

  try {
    run = await Run.create({
      name: req.body.fields.input.name,
    });
  } catch (err) {
    autoDecrementModelID(Model.collection.collectionName, Model, next);
    return next(new AppError('Error while creating new document', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      run,
    },
  });
});

exports.updateRun = catchAsync(async (req, res, next) => {
  const run = await Run.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.fields.input.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!run) {
    return next(new AppError('No run found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      run,
    },
  });
});

exports.deleteRun = catchAsync(async (req, res, next) => {
  const run = await Run.findByIdAndDelete(req.params.id);

  if (!run) {
    return next(new AppError('No run found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
