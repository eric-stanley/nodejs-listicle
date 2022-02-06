const express = require('express');
const accessController = require('../controllers/accessController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    accessController.updateFilter,
    accessController.getAllAccesses
  )
  .post(
    authController.protect,
    accessController.isAuthorized,
    accessController.createAccess
  );

router
  .route('/:id')
  .get(
    authController.protect,
    accessController.updateFilter,
    accessController.getAccess
  )
  .patch(
    authController.protect,
    accessController.isAuthorized,
    accessController.updateAccess
  )
  .delete(
    authController.protect,
    accessController.isAuthorized,
    accessController.deleteAccess
  );

module.exports = router;
