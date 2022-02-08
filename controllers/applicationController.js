const Application = require('../models/applicationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Access = require('../models/accessModel');
const Project = require('../models/projectModel');
const Role = require('../models/roleModel');

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

    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(new AppError('No application found with that ID', 404));
    }

    // Check if current user is assigned to the project
    const currentUserAccess = await Access.findOne({
      user_id: req.user.id,
      project_id: application.project_id,
      is_active: true,
    });

    if (!currentUserAccess && !req.user.is_admin) {
      return next(
        new AppError(
          'User not assigned to the project or project is not active',
          404
        )
      );
    }

    // Check if user role is eligible to make changes or user is admin
    if (currentUserAccess) {
      const userRole = await Role.findById(currentUserAccess.role_id);

      if (
        !req.user.is_admin &&
        !eligibleAccesses.includes(userRole.description.toLowerCase())
      ) {
        return next(
          new AppError('You do not have access to perform this action', 403)
        );
      }
    }
  } else {
    // Create application

    // Check if project is active
    const project = await Project.findOne({
      _id: req.body.fields.input.project_id,
      is_active: true,
    });

    if (!project) {
      return next(
        new AppError('Requested project not found or is inactive', 403)
      );
    }

    // Check if user is project owner
    if (project.owner === req.user.id) {
      req.user.is_project_admin = true;
    }

    // Check if user is has eligible access within the project
    const access = await Access.findOne({
      user_id: req.user.id,
      project_id: req.body.fields.input.project_id,
      is_active: true,
    });

    if (!access && !req.user.is_admin && !req.user.is_project_admin) {
      return next(
        new AppError('No access found for this user in this project', 403)
      );
    }

    // check if user has eligible access to create access
    if (access) {
      const currentUserRole = await Role.findById(access.role_id);

      if (!currentUserRole) {
        return next(new AppError('Invalid role assigned to you', 403));
      }

      const userRoleDescription = currentUserRole.description;

      if (!eligibleAccesses.includes(userRoleDescription.toLowerCase())) {
        return next(
          new AppError('You do not have access to perform this action', 403)
        );
      }
    }
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
