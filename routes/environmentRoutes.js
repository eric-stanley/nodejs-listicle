const express = require('express');
const environmentController = require('../controllers/environmentController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    environmentController.getAllEnvironments
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    environmentController.createEnvironment
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    environmentController.getEnvironment
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    environmentController.updateEnvironment
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    environmentController.deleteEnvironment
  );

module.exports = router;
