const express = require('express');
const priorityController = require('../controllers/priorityController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    priorityController.getAllPriorities
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    priorityController.createPriority
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    priorityController.getPriority
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    priorityController.updatePriority
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    priorityController.deletePriority
  );

module.exports = router;
