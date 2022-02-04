const Project = require('../models/projectModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');

exports.isAuthorized = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  // Check if owner is active
  const projectOwner = await User.findById(project.owner);

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

exports.getAllProjects = catchAsync(async (req, res) => {
  const defaultField = 'name';
  const defaultPage = 1;
  const defaultLimit = 10;
  let filter = {};

  // Retrieve all projects if admin
  if (!req.user.is_admin) {
    filter = {
      owner: req.user.id,
    };
  }

  // Execute query
  const features = new APIFeatures(
    Project.find(filter),
    req.body,
    defaultField,
    defaultPage,
    defaultLimit
  )
    .filter()
    .sort()
    .select()
    .paginate();
  const projects = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create({
    name: req.body.fields.input.name,
    owner: req.user.id,
    is_active: req.body.fields.input.is_active,
  });

  res.status(201).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body.fields.input, 'name', 'is_active');
  const project = await Project.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
