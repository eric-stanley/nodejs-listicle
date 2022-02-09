const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.updateFilter('owner'),
    categoryController.getAllCategories
  )
  .post(
    authController.protect,
    categoryController.isAuthorized,
    categoryController.updateOwner,
    categoryController.createCategory
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.updateFilter('owner'),
    categoryController.getCategory
  )
  .patch(
    authController.protect,
    categoryController.isAuthorized,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    categoryController.isAuthorized,
    categoryController.deleteCategory
  );

module.exports = router;
