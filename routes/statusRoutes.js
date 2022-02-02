const express = require('express');
const statusController = require('../controllers/statusController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    statusController.getAllStatuses
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    statusController.createStatus
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    statusController.getStatus
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    statusController.updateStatus
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    statusController.deleteStatus
  );

module.exports = router;
