const Category = require('../models/categoryModel');
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
    // Get, update and delete category
    const category = checkAccess.checkIdExistance(
      Category,
      req.params.id,
      next
    );
    checkAccess.checkAccessForUpdate(
      req,
      next,
      eligibleAccesses,
      category,
      req.user.id,
      category.project_id
    );
  } else {
    // Create category
    checkAccess.checkProjectAccess(req, req.body.fields.input.project_id, next);
    checkAccess.checkEligibilityAccess(
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

exports.getAllCategories = factory.getAll(
  Category,
  defaultField,
  defaultPage,
  defaultLimit
);
exports.getCategory = factory.getOne(Category, ['users', 'projects']);
exports.createCategory = factory.createOne(
  Category,
  'name',
  'project_id',
  'owner'
);
exports.updateCategory = factory.updateOne(Category, 'name');
exports.deleteCategory = factory.deleteOne(Category);
