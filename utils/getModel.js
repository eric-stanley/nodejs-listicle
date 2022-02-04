const accessModel = require('../models/accessModel');
const applicationModel = require('../models/applicationModel');
const categoryModel = require('../models/categoryModel');
const environmentModel = require('../models/environmentModel');
const groupModel = require('../models/groupModel');
const priorityModel = require('../models/priorityModel');
const projectModel = require('../models/projectModel');
const roleModel = require('../models/roleModel');
const runModel = require('../models/runModel');
const statusModel = require('../models/statusModel');
const userModel = require('../models/userModel');
const userRoleModel = require('../models/userRoleModel');

module.exports = (modelName) => {
  switch (modelName) {
    case 'accesses':
      return accessModel;
    case 'applications':
      return applicationModel;
    case 'categories':
      return categoryModel;
    case 'environments':
      return environmentModel;
    case 'groups':
      return groupModel;
    case 'priorities':
      return priorityModel;
    case 'projects':
      return projectModel;
    case 'roles':
      return roleModel;
    case 'runs':
      return runModel;
    case 'status':
      return statusModel;
    case 'users':
      return userModel;
    case 'userroles':
      return userRoleModel;
  }
};
