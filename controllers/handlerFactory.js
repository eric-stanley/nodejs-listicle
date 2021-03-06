const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const filterObj = require('../utils/filterObj');
const modelIds = require('../constants/modelIds');
const { autoSequenceModelID } = require('../models/counterModel');
const getModel = require('../utils/getModel');
const errors = require('../constants/errors');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const keys = Object.keys(modelIds);
    const values = Object.values(modelIds);

    let filter = {};

    keys.forEach(async (key, index) => {
      if (key === Model.collection.collectionName) {
        filter[values[index]] = req.params.id;
      }
    });

    const doc = await Model.findOneAndDelete(filter);

    if (!doc) {
      return next(
        new AppError(
          errors.generalErrors.noDocumentFound.message,
          errors.generalErrors.noDocumentFound.statusCode
        )
      );
    }

    keys.forEach(async (key, index) => {
      if (key === Model.collection.collectionName) {
        await autoSequenceModelID(key, getModel(key), values[index], -1, next);
      }
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model, ...fields) =>
  catchAsync(async (req, res, next) => {
    const keys = Object.keys(modelIds);
    const values = Object.values(modelIds);
    let filter = {};

    keys.forEach(async (key, index) => {
      if (key === Model.collection.collectionName) {
        filter[values[index]] = req.params.id;
      }
    });

    const model = await Model.findOne(filter);

    if (!model) {
      return next(
        new AppError(
          errors.generalErrors.noDocumentFound.message,
          errors.generalErrors.noDocumentFound.statusCode
        )
      );
    }

    const filteredBody = filterObj(req.body.fields.input, fields);

    const doc = await Model.findByIdAndUpdate(model.id, filteredBody, {
      new: true,
      runValidators: true,
    }).select('-_id -id -__v');

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

    const returnDoc = doc.toObject();

    returnDoc._id = returnDoc.id = returnDoc.__v = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        data: returnDoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const keys = Object.keys(modelIds);
    const values = Object.values(modelIds);
    let filter = {};

    keys.forEach(async (key, index) => {
      if (key === Model.collection.collectionName) {
        filter[values[index]] = req.params.id;
      }
    });

    let query = Model.findOne(filter, { _id: 0, id: 0, __v: 0 });

    if (populateOptions && populateOptions.length > 0) {
      populateOptions.forEach((item) => {
        query = query.populate({
          path: item,
          options: { select: { id: 0, __v: 0 } },
        });
      });
    }

    const doc = await query;

    if (!doc) {
      return next(
        new AppError(
          errors.generalErrors.noDocumentFound.message,
          errors.generalErrors.noDocumentFound.statusCode
        )
      );
    }

    const returnDoc = doc.toObject();
    delete returnDoc.id;

    res.status(200).json({
      status: 'success',
      data: {
        data: returnDoc,
      },
    });
  });

exports.getAll = (Model, defaultField, defaultPage, defaultLimit) =>
  catchAsync(async (req, res) => {
    // Execute query
    const features = new APIFeatures(
      Model.find(req.body.filter, { _id: 0, __v: 0, id: 0 }),
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

    const returnDocs = docs
      .map(({ id, $__, $isNew, ...rest }) => rest)
      .map((obj) => Object.assign(obj._doc));

    // Send response
    res.status(200).json({
      status: 'success',
      results: returnDocs.length,
      data: {
        data: returnDocs,
      },
    });
  });
