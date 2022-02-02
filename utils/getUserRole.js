const UserRole = require('../models/userRoleModel');
const Role = require('../models/roleModel');
const AppError = require('../utils/appError');

module.exports = async (user_id, next) => {
  const userRole = await UserRole.findOne({
    user_id,
  });

  if (!userRole || !userRole.is_active) {
    return next(
      new AppError('No role assigned to the user or user role is inactive', 403)
    );
  }

  const currentUserRole = await Role.findById(userRole.role_id);

  if (!currentUserRole) {
    return next(new AppError('Invalid role specified', 403));
  }

  return currentUserRole;
};
