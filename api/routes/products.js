const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Product = require('../models/product');

router.route('/')
    .get(function (req, res) {
        Product.find()
            .select('name price _id')
            .exec()
            .then(docs => {
                const response = {
                    count : docs.length, 
                    products : docs.map(doc =>{
                        return {
                            name : doc.name, 
                            price : doc.price,
                            _id : doc._id, 
                            request : {
                                type: 'GET',
                                url : 'http://localhost:3000/products/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            })
    })
    .post(function (req, res) {
        const product = new Product({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        });

        product.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name : result.name,
                    price : result.price,
                    _id : result._id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    });

router.route('/:productId')
    .get(function (req, res) {
        const id = req.params.productId;
        Product.findById(id)
            .select('name price _id')
            .exec()
            .then(doc => {
                console.log(doc);
                if (doc) {
                    res.status(200).json({
                        product : doc, 
                        request : {
                            type : 'GET',
                            description : 'Get all products',
                            url : 'http://localhost:3000/products'
                        }
                    });
                } else {
                    res.status(404).json({ message: 'No data found for provided id' })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err })
            });
    })
    .patch(function (req, res) {
        const id = req.params.productId;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.name] = ops.value;
        }
        Product.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json({
                    message : 'Product updated',
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/' + id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err })
            });
    })
    .delete(function (req, res) {
        Product.remove({ _id: req.params.productId })
            .exec()
            .then(result => {
                res.status(200).json({
                    message : 'Product deleted',
                    request : {
                        type : 'POST',
                        url : 'http://localhost:3000/products',
                        body : {name:'String', price:'Number'}
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err })
            });
    });


module.exports = router;