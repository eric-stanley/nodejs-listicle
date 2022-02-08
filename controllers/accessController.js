const Access = require('../models/accessModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const checkAccess = require('../utils/checkAccess');

const eligibleAccesses = [
  'admin',
  'portfolio manager',
  'program manager',
  'project manager',
];

exports.isAuthorized = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    // Get, update and delete access
    const access = checkAccess.checkIdExistance(Access, req.params.id, next);
    checkAccess.checkAccessForUpdate(
      req,
      next,
      eligibleAccesses,
      access,
      req.user.id,
      access.project_id
    );
  } else {
    // Create access
    checkAccess.checkProjectAccess(req, req.body.fields.input.project_id, next);
    checkAccess.checkEligibilityAccess(
      req,
      next,
      eligibleAccesses,
      req.user.id,
      req.body.fields.input.project_id
    );
    checkAccess.checkUserAccess(req, req.body.fields.input.user_id, next);
    checkAccess.checkExistingAccess(
      req,
      next,
      req.body.fields.input.user_id,
      req.body.fields.input.project_id,
      req.body.fields.input.role_id
    );
  }

  next();
});

const defaultField = 'user_id';
const defaultPage = 1;
const defaultLimit = 10;

exports.getAllAccesses = factory.getAll(
  Access,
  defaultField,
  defaultPage,
  defaultLimit
);
exports.getAccess = factory.getOne(Access, ['users', 'roles', 'projects']);
exports.createAccess = factory.createOne(
  Access,
  'user_id',
  'role_id',
  'project_id'
);
exports.updateAccess = factory.updateOne(Access, 'is_active');
exports.deleteAccess = factory.deleteOne(Access);
