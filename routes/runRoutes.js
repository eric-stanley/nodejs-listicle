const express = require('express');
const runController = require('../controllers/runController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictFrom('guest'),
    runController.getAllRuns
  )
  .post(
    authController.protect,
    authController.restrictFrom('guest'),
    runController.generateRun,
    runController.createRun
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictFrom('guest'),
    runController.getRun
  )
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
