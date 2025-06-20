const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categorymanagement');
const upload = require('../../middlewares/fileupload'); // multer setup

// Create category with image upload
router.post(
  '/',
  upload.single('image'), // expecting form-data with key "image"
  categoryController.createCategory
);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Update category with optional image
router.put(
  '/:id',
  upload.single('image'),
  categoryController.updateCategory
);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
