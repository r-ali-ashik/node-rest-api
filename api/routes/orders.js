const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.route('/')
    .get(function (req, res) {
        Order.find()
            .select('productId quantity _id')
            .exec()
            .then(orders => {
                const response = {
                    count: orders.length,
                    orders: orders.map(order => {
                        return {
                            _id: order._id,
                            quantity: order.quantity,
                            productId: order.productId,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + order._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
    .post(function (req, res) {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });

        order.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Order created successfully',
                    createedOrder: {
                        _id: result._id,
                        quantity: result.quantity,
                        productId: result.productId,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    }
                });

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

router.route('/:orderId')
    .get(function (req, res) {
        const id = req.params.orderId;
        Order.findById(id)
            .select('quantity product _id')
            .exec()
            .then(order => {
                console.log(order);
                if (order) {
                    res.status(200).json({
                        order: order,
                        request: {
                            type: 'GET',
                            description: 'Get all orders',
                            url: 'http://localhost:3000/orders'
                        }
                    });
                } else {
                    res.status(404).json({
                        message: 'No data found for provided id'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    })
    .post(function (req, res) {
        res.status(201).json({
            message: 'order was created'
        });
    })
    .delete(function (req, res) {
        res.status(200).json({
            message: 'order deleted'
        });
    });

module.exports = router;