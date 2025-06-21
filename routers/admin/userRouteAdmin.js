// const express = require("express")
// const router = express.Router()
// const { createUser, 
//     getUsers, getOneUser, updateOne, deleteOne
// } = require("../../controllers/admin/usermanagement")
// const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser")

// // 5 common api route
// router.post(
//     "/",
//     createUser
// )

// router.get(
//     "/",
//     authenticateUser, // next() goes to next getUser
//     isAdmin,
//     getUsers
// )

// router.get(
//     "/:id", // req.params.id
//     getOneUser
// )
// router.put(
//     "/:id", // req.params.id
//     updateOne
// )
// router.delete(
//     "/:id", // req.params.id
//     deleteOne
// )
// module.exports = router

// const express = require("express")
// const router = express.Router()

// const upload = require('../../middlewares/fileupload');

// const productController = require("../../controllers/admin/productmanagement")
// // can be imported as singular
// // perviously
// // const {createProduct} = require("../../controllers/admin/productmanagement")
// // per function
// router.post("/", upload.single("productImage"), productController.createProduct);

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

const upload = require('../../middlewares/fileupload');
const productController = require("../../controllers/admin/productmanagement");

// ✅ Create product with image upload
router.post("/", upload.single("productImage"), productController.createProduct);

// ✅ Get all products
router.get("/", productController.getProducts);

module.exports = router;
