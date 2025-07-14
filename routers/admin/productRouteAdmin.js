const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productmanagement");
const upload = require('../../middlewares/fileupload');

// Create a new product
router.post("/",  upload.single('image'), productController.createProduct);

router.get("/:id", productController.getOneProduct);

// Get all products (with pagination + search)
router.get("/", productController.getProducts);

// ✅ Create a new product (with image upload)
router.post("/", upload.single('image'), productController.createProduct);

// ✅ Get all products with pagination and search
router.get("/", productController.getProducts);

router.put('/:id', upload.single('image'), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
