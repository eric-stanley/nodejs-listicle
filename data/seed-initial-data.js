const fs = require('fs');

const Role = require('../models/roleModel');
const Environment = require('../models/environmentModel');
const Group = require('../models/groupModel');
const Priority = require('../models/priorityModel');
const Status = require('../models/statusModel');
const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');

// Read json file
const roles = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/roles.json`, 'utf-8')
);

const environments = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/environments.json`, 'utf-8')
);
const groups = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/groups.json`, 'utf-8')
);
const priorities = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/priorities.json`, 'utf-8')
);
const statuses = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/status.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/users.json`, 'utf-8')
);
const userroles = JSON.parse(
  fs.readFileSync(`${__dirname}/test/json/seed/userroles.json`, 'utf-8')
);

// Import data to db
exports.importData = async () => {
  try {
    await Role.create(roles);
    await Environment.create(environments);
    await Group.create(groups);
    await Priority.create(priorities);
    await Status.create(statuses);
    await User.create(users);
    await UserRole.create(userroles);
  } catch (err) {
    console.log(err);
  }
};
