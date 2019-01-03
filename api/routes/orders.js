const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.route('/')
    .get(function (req, res) {
        res.status(200).json({
            message: 'Handing GET request to /orders'
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
                res.status(201).json(result);

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
        const id = req.params.productId;
        res.status(200).json({
            message: 'order details',
            id: id
        })
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