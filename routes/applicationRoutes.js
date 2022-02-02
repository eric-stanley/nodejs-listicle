const express = require('express');
const applicationController = require('../controllers/applicationController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, applicationController.getAllApps)
  .post(authController.protect, applicationController.createApp);

router
  .route('/:id')
  .get(authController.protect, applicationController.getApp)
  .patch(authController.protect, applicationController.updateApp)
  .delete(authController.protect, applicationController.deleteApp);

module.exports = router;
