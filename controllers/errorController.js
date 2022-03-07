const AppError = require('../utils/appError');
const { autoSequenceModelID } = require('../models/counterModel');
const modelIds = require('../constants/modelIds');
const getModel = require('../utils/getModel');
const errors = require('../constants/errors');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(message, errors.generalErrors.duplicateKey.statusCode);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTInvalidTokenError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    statk: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('Error: ', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.code === 11000) {
    // Auto decrement the model
    const errorMessage = err.message || err._message;
    const collectionName = errorMessage.split('.')[1].split(' ')[0];
    const keys = Object.keys(modelIds);
    const values = Object.values(modelIds);
    keys.forEach(async (key, index) => {
      if (key === collectionName) {
        await autoSequenceModelID(key, getModel(key), values[index], -1, next);
      }
    });
    err.statusCode = 400;
  }

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.path && error.value) error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (
      error._message &&
      error._message.toLowerCase().endsWith('validation failed')
    )
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJWTInvalidTokenError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
