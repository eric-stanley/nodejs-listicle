const express = require('express');
const applicationController = require('../controllers/applicationController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.updateFilter,
    applicationController.getAllApps
  )
  .post(
    authController.protect,
    applicationController.isAuthorized,
    applicationController.updateOwner,
    applicationController.createApp
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.updateFilter,
    applicationController.getApp
  )
  .patch(
    authController.protect,
    applicationController.isAuthorized,
    applicationController.updateApp
  )
  .delete(
    authController.protect,
    applicationController.isAuthorized,
    applicationController.deleteApp
  );

module.exports = router;
