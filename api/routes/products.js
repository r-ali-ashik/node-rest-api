const express = require('express');


const checkAuth = require('../middleware/check-auth');
const productService = require('../service/productService');

const router = express.Router();

const Product = require('../models/product');

router.route('/')
    .get(productService.getProducts)
    .post(checkAuth, productService.createProduct);

router.route('/:productId')
    .get(productService.getProduct)
    .patch(checkAuth, productService.updateProduct)
    .delete(checkAuth, productService.deleteProduct);


module.exports = router;