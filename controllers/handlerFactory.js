const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      {
        description: req.body.fields.input.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({
      description: req.body.fields.input.description,
    });
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, defaultField, defaultPage, defaultLimit) =>
  catchAsync(async (req, res) => {
    // Execute query
    const features = new APIFeatures(
      Model.find(),
      req.body,
      defaultField,
      defaultPage,
      defaultLimit
    )
      .filter()
      .sort()
      .select()
      .paginate();
    const docs = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
