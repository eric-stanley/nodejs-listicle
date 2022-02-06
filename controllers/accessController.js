const Access = require('../models/accessModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const UserRole = require('../models/userRoleModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const factory = require('./handlerFactory');
const eligibleAccesses = [
  'admin',
  'portfolio manager',
  'program manager',
  'project manager',
];

exports.isAuthorized = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    // Get, update and delete access

    const access = await Access.findById(req.params.id);

    if (!access) {
      return next(new AppError('No access found with that ID', 404));
    }

    // Check if current user is assigned to the project
    currentUserAccess = await Access.findOne({
      user_id: req.user.id,
      project_id: access.project_id,
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
    // Create access

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
      console.log(currentUserRole);
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

    // Check if requested user is active
    const user = await User.findById(req.body.fields.input.user_id).select(
      '+is_active'
    );
    if (!user || !user.is_active) {
      return next(new AppError('Requested user not found or inactive', 403));
    }

    // Check if user has an active role
    const userRole = await UserRole.findOne({
      user_id: user.id,
    }).select('+is_active');

    if (!userRole || !userRole.is_active) {
      return next(
        new AppError(
          'Requested user does not have any role or the role is inactive',
          403
        )
      );
    }

    // Check if access already exists
    const existingAccess = await Access.findOne({
      user_id: req.body.fields.input.user_id,
      project_id: req.body.fields.input.project_id,
      role_id: req.body.fields.input.role_id,
      is_active: true,
    });

    if (existingAccess) {
      return next(
        new AppError(
          'Requested user already has access to this project with the requested role',
          403
        )
      );
    }
  }

  next();
});

const defaultField = 'user_id';
const defaultPage = 1;
const defaultLimit = 10;

exports.updateFilter = (req, res, next) => {
  let filter = {};
  // Retrieve all projects if admin
  if (!req.user.is_admin) {
    filter = {
      user_id: req.user.id,
    };
  }

  // Apply id filter
  if (req.params.id) {
    filter._id = req.params.id;
  }

  req.body.filter = filter;

  next();
};

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
