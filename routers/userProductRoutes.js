const express = require('express');
const router = express.Router();
const { getProductsByCategory } = require('../controllers/UserProductController');

// GET /api/products?categoryName=tops
router.get('/products', getProductsByCategory);

module.exports = router;

