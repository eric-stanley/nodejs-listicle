const Access = require('../models/accessModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const UserRole = require('../models/userRoleModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
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

    if (!currentUserAccess) {
      return next(
        new AppError(
          'User not assigned to the project or project is not active',
          404
        )
      );
    }

    // Check if user role is eligible to make changes or user is admin
    const userRole = await Role.findById(currentUserAccess.role_id);

    if (
      !req.user.is_admin &&
      !eligibleAccesses.includes(userRole.description.toLowerCase())
    ) {
      return next(
        new AppError('You do not have access to perform this action', 403)
      );
    }
  } else {
    // Create access

    // Check if admin
    if (req.user.is_admin) return next();

    // Check if user is has eligible access within the project
    const access = await Access.findOne({
      user_id: req.user.id,
      project_id: req.body.fields.input.project_id,
      is_active: true,
    });

    if (!access) {
      return next(
        new AppError('No access found for this user in this project', 403)
      );
    }

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
      return next();
    }

    // Check if requested user is active
    const user = await User.findById(req.body.fields.input.user_id);

    if (!user || !user.is_active) {
      return next(new AppError('Requested user not found or inactive', 403));
    }

    // Check if user has an active role
    const userRole = await UserRole.findOne({
      user_id: user.id,
    });

    if (!userRole || !userRole.is_active) {
      return next(
        new AppError(
          'Requested user does not have any role or the role is inactive',
          403
        )
      );
    }

    // check if user has eligible access to create access
    const requestedUserRole = await Role.findById(access.role_id);
    const userRoleDescription = requestedUserRole.description;

    if (!eligibleAccesses.includes(userRoleDescription.toLowerCase())) {
      return next(
        new AppError('You do not have access to perform this action', 403)
      );
    }
  }

  next();
});

exports.getAllAccesses = catchAsync(async (req, res) => {
  const defaultField = 'user_id';
  const defaultPage = 1;
  const defaultLimit = 10;
  let filter = {};

  // Retrieve all projects if admin
  if (!req.user.is_admin) {
    filter = {
      user_id: req.user.id,
    };
  }

  // Execute query
  const features = new APIFeatures(
    Access.find(filter),
    req.body,
    defaultField,
    defaultPage,
    defaultLimit
  )
    .filter()
    .sort()
    .select()
    .paginate();
  const accesses = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: accesses.length,
    data: {
      accesses,
    },
  });
});

exports.getAccess = catchAsync(async (req, res, next) => {
  // Retrieve all projects if admin
  let filter = {
    _id: req.params.id,
  };

  if (!req.user.is_admin) filter.user_id = req.user.id;
  console.log(filter);

  const access = await Access.find(filter)
    .populate({ path: 'users' })
    .populate({ path: 'roles' })
    .populate({ path: 'projects' });

  if (!access) {
    return next(new AppError('No access found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      access,
    },
  });
});

exports.createAccess = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body.fields.input,
    'user_id',
    'role_id',
    'project_id',
    'is_active'
  );

  const access = await Access.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      access,
    },
  });
});

exports.updateAccess = catchAsync(async (req, res, next) => {
  const access = await Access.findByIdAndUpdate(
    req.params.id,
    {
      is_active: req.body.fields.input.is_active,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!access) {
    return next(new AppError('No access found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      access,
    },
  });
});

exports.deleteAccess = catchAsync(async (req, res, next) => {
  const access = await Access.findByIdAndDelete(req.params.id);

  if (!access) {
    return next(new AppError('No access found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
