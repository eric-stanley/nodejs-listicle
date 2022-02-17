const Application = require('../models/applicationModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const checkAccess = require('../utils/checkAccess');

const eligibleAccesses = [
  'admin',
  'portfolio manager',
  'program manager',
  'project manager',
];

const defaultField = 'name';
const defaultPage = 1;
const defaultLimit = 10;

exports.isAuthorized = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    // Get, update and delete application
    const application = await checkAccess.checkIdExistance(
      Application,
      req.params.id,
      next
    );
    await checkAccess.checkAccessForUpdate(
      req,
      next,
      eligibleAccesses,
      req.user.id,
      application.project_id
    );
  } else {
    // Create application
    await checkAccess.checkProjectAccess(
      req,
      req.body.fields.input.project_id,
      next
    );
    await checkAccess.checkEligibilityAccess(
      req,
      next,
      eligibleAccesses,
      req.user.id,
      req.body.fields.input.project_id
    );
  }

  next();
});

exports.updateOwner = (req, res, next) => {
  req.body.fields.input.owner = req.user.id;
  next();
};

exports.getAllApps = factory.getAll(
  Application,
  defaultField,
  defaultPage,
  defaultLimit
);
exports.getApp = factory.getOne(Application, ['users', 'projects']);
exports.createApp = factory.createOne(
  Application,
  'name',
  'project_id',
  'owner'
);
exports.updateApp = factory.updateOne(Application, 'name');
exports.deleteApp = factory.deleteOne(Application);
