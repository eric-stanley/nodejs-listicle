const express = require('express');
const userRoleController = require('../controllers/userRoleController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userRoleController.getAllUserRoles
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userRoleController.checkUserRole,
    userRoleController.createUserRole
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userRoleController.getUserRole
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userRoleController.updateUserRole
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userRoleController.deleteUserRole
  );

module.exports = router;
