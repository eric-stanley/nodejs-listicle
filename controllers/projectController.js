const Project = require('../models/projectModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const defaultField = 'name';
const defaultPage = 1;
const defaultLimit = 10;

exports.isAuthorized = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  // Check if owner is active
  const projectOwner = await User.findById(project.owner).select('+is_active');

  if (!projectOwner || !projectOwner.is_active) {
    return next(new AppError('Owner not active for this project', 403));
  }

  // Check if user is owner or admin
  if (!req.user.is_admin && req.user.id !== projectOwner.id) {
    return next(
      new AppError(
        'You have to be either owner or admin to perform this action',
        403
      )
    );
  }

  next();
});

exports.updateOwner = (req, res, next) => {
  req.body.fields.input.owner = req.user.id;
  next();
};

exports.updateFilter = (req, res, next) => {
  let filter = {};
  // Retrieve all projects if admin
  if (!req.user.is_admin) {
    filter = {
      owner: req.user.id,
    };
  }

  // Apply id filter
  if (req.params.id) {
    filter._id = req.params.id;
  }

  req.body.filter = filter;

  next();
};

exports.getAllProjects = factory.getAll(
  Project,
  defaultField,
  defaultPage,
  defaultLimit
);
exports.getProject = factory.getOne(Project, ['users']);
exports.createProject = factory.createOne(Project, 'name', 'owner');
exports.updateProject = factory.updateOne(Project, 'name', 'is_active');
exports.deleteProject = factory.deleteOne(Project);
