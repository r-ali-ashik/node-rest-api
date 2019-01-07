const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const orderService = require('../service/orderService');

router.route('/')
    .get(checkAuth, orderService.getOrders)
    .post(checkAuth, orderService.createOrder);

router.route('/:orderId')
    .get(checkAuth, orderService.getOrder)
    .delete(checkAuth, orderService.deleteOrder);

module.exports = router;