const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categorymanagement');
const upload = require('../../middlewares/fileupload'); // multer setup

router.post(
    '/', 
    upload.single("image"),
    // req.file, req.files from next function
    // get image, file metadata
    categoryController.createCategory
);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', 
    upload.single("image"),
    categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
