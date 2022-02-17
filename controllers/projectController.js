const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const checkAccess = require('../utils/checkAccess');

const defaultField = 'name';
const defaultPage = 1;
const defaultLimit = 10;

exports.isAuthorized = catchAsync(async (req, res, next) => {
  const project = await Project.checkIdExistance(Project, req.params.id, next);
  await checkAccess.checkProjectOwner(req, project, next);
  next();
});

exports.updateOwner = (req, res, next) => {
  req.body.fields.input.owner = req.user.id;
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
