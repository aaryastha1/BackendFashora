// const express = require("express")
// const router = express.Router()
// const productController = require("../../controllers/admin/productmanagement")
// // can be imported as singular
// // perviously
// // const {createProduct} = require("../../controllers/admin/productmanagement")
// // per function

// router.post(
//     "/",
//     productController.createProduct // using dot, get function
// )
// router.get(
//     "/",
//     productController.getProducts
// )
// module.exports = router


const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/fileupload");
const productController = require("../../controllers/admin/productmanagement");

// ✅ This must be the ONLY post route
router.post("/", upload.single("productImage"), productController.createProduct);

// ✅ This is fine for fetching
router.get("/", productController.getProducts);

module.exports = router;
