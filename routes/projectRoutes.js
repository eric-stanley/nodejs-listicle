const express = require('express');
const projectController = require('../controllers/projectController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    projectController.updateFilter,
    projectController.getAllProjects
  )
  .post(
    authController.protect,
    authController.restrictTo(
      'admin',
      'portfolio manager',
      'program manager',
      'project manager'
    ),
    projectController.updateOwner,
    projectController.createProject
  );

router
  .route('/:id')
  .get(
    authController.protect,
    projectController.isAuthorized,
    projectController.updateFilter,
    projectController.getProject
  )
  .patch(
    authController.protect,
    projectController.isAuthorized,
    projectController.updateProject
  )
  .delete(
    authController.protect,
    projectController.isAuthorized,
    projectController.deleteProject
  );

module.exports = router;
