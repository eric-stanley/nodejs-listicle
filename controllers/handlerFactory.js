const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const filterObj = require('../utils/filterObj');
const modelIds = require('../constants/modelIds');
const { autoDecrementModelID } = require('../models/counterModel');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const keys = Object.keys(modelIds);
    const values = Object.values(modelIds);
    console.log(Model.collection.collectionName);
    keys.forEach((key, index) => {
      if (key === Model.collection.collectionName) {
        console.log(Model.collection.collectionName, Model, values[index]);
        autoDecrementModelID(
          Model.collection.collectionName,
          Model,
          values[index]
        );
      }
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model, ...fields) =>
  catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body.fields.input, fields);
    const doc = await Model.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true,
    });

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

exports.createOne = (Model, ...fields) =>
  catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body.fields.input, fields);
    const doc = await Model.create(filteredBody);

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

    if (populateOptions && populateOptions.length > 0) {
      populateOptions.forEach((item, i) => {
        query = query.populate({ path: item });
      });
    }

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
      Model.find(req.body.filter),
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
