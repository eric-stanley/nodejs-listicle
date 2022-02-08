const express = require('express');
const runController = require('../controllers/runController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    runController.getAllRuns
  )
  .post(authController.protect, runController.createRun);

router
  .route('/:id')
  .get(authController.protect, runController.getRun)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    runController.updateRun
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    runController.deleteRun
  );

module.exports = router;
