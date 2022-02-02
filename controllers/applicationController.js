const Application = require('../models/applicationModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllApps = catchAsync(async (req, res) => {
  const defaultField = 'name';
  const defaultPage = 1;
  const defaultLimit = 10;

  // Execute query
  const features = new APIFeatures(
    Application.find(),
    req.body,
    defaultField,
    defaultPage,
    defaultLimit
  )
    .filter()
    .sort()
    .select()
    .paginate();
  const apps = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: apps.length,
    data: {
      apps,
    },
  });
});

exports.getApp = catchAsync(async (req, res, next) => {
  const app = await Application.findById(req.params.id);

  if (!app) {
    return next(new AppError('No app found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      app,
    },
  });
});

exports.createApp = catchAsync(async (req, res, next) => {
  const app = await Application.create({
    name: req.body.fields.input.name,
  });
  res.status(201).json({
    status: 'success',
    data: {
      app,
    },
  });
});

exports.updateApp = catchAsync(async (req, res, next) => {
  const app = await Application.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.fields.input.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!app) {
    return next(new AppError('No app found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      app,
    },
  });
});

exports.deleteApp = catchAsync(async (req, res, next) => {
  const app = await Application.findByIdAndDelete(req.params.id);

  if (!app) {
    return next(new AppError('No app found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
