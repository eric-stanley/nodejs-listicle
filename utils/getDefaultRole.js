const Role = require('../models/roleModel');
const defaultRole = 'guest';

module.exports = async () => {
  const role = await Role.findOne({
    description: defaultRole,
  });
  return role;
};
