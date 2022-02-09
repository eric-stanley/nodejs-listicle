const Access = require('../models/accessModel');
const Project = require('../models/projectModel');
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');

exports.checkIdExistance = catchAsync(async (Model, id, next) => {
  const model = await Model.findById(id).select('+is_active');

  if (!model) {
    return next(new AppError('No document found with that ID', 404));
  }
  return model;
});

exports.checkAccessForUpdate = catchAsync(
  async (req, next, eligibleAccesses, access, user_id, project_id) => {
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
  }
);

exports.checkProjectAccess = catchAsync(async (req, id, next) => {
  const project = this.checkIdExistance(Project, id, next);

  // Check if user is project owner
  if (project.owner === req.user.id) {
    req.user.is_project_admin = true;
  }
});

exports.checkProjectOwner = catchAsync(async (req, project, next) => {
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
});

exports.checkEligibilityAccess = catchAsync(
  async (req, next, eligibleAccesses, user_id, project_id) => {
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
  }
);

exports.checkUserAccess = catchAsync(async (req, user_id, next) => {
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
});

exports.checkExistingAccess = catchAsync(
  async (req, next, user_id, project_id, role_id) => {
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
  }
);

exports.checkUserRoleInput = catchAsync(async (input, next) => {
  const { role_id, user_id } = input;

  // Check if role exists
  const role = await Role.findById(role_id);

  if (!role) {
    return next(new AppError('No role found with that ID', 404));
  }

  // Check if user exists
  const user = await User.findById(user_id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Check if user role combination exists and is active
  const userRole = await UserRole.findOne({
    role_id,
    user_id,
  });

  if (userRole && userRole.is_active) {
    return next(
      new AppError('User role combination is already exists and active', 403)
    );
  }
  if (userRole) {
    return next(
      new AppError(
        'User role already exists. Please use update path to acivate/inactivate role',
        403
      )
    );
  }
});

exports.checkUserRoleId = catchAsync(async (id, input, next) => {
  const userRole = await UserRole.findById(id);

  // Check if user role exists
  if (!userRole) {
    return next(new AppError('No user role found with that ID', 404));
  }

  const { role_id, user_id, is_active } = input;

  // Check if is_active indicator is changed
  if (
    userRole.role_id.toString() === role_id &&
    userRole.user_id.toString() === user_id &&
    userRole.is_active === is_active
  ) {
    return next(new AppError('User role combination is already exists', 403));
  }
});
