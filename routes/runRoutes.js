const express = require('express');
const runController = require('../controllers/runController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, runController.getAllRuns)
  .post(authController.protect, runController.createRun);

router
  .route('/:id')
  .get(authController.protect, runController.getRun)
  .patch(authController.protect, runController.updateRun)
  .delete(authController.protect, runController.deleteRun);

module.exports = router;
