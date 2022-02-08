const Access = require('../models/accessModel');
const Project = require('../models/projectModel');
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');
const AppError = require('./appError');

exports.checkIdExistance = async (Model, id, next) => {
  const model = await Model.findById(id);

  if (!model) {
    return next(new AppError('No document found with that ID', 404));
  }
  return model;
};

exports.checkAccessForUpdate = async (
  req,
  next,
  eligibleAccesses,
  access,
  user_id,
  project_id
) => {
  // Check if current user is assigned to the project
  const currentUserAccess = await Access.findOne({
    user_id,
    project_id,
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
};

exports.checkProjectAccess = async (req, id, next) => {
  const project = this.checkIdExistance(Project, id, next);

  // Check if user is project owner
  if (project.owner === req.user.id) {
    req.user.is_project_admin = true;
  }
};

exports.checkEligibilityAccess = async (
  req,
  next,
  eligibleAccesses,
  user_id,
  project_id
) => {
  const access = await Access.findOne({
    user_id,
    project_id,
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
};

exports.checkUserAccess = async (req, user_id, next) => {
  const user = await User.findById(user_id).select('+is_active');
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
};

exports.checkExistingAccess = async (
  req,
  next,
  user_id,
  project_id,
  role_id
) => {
  const existingAccess = await Access.findOne({
    user_id,
    project_id,
    role_id,
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
};
