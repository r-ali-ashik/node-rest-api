const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.route('/sign-up')
    .post(function (req, res) {
        User.find({
                email: req.body.email
            })
            .exec()
            .then(result => {
                if (result.length >= 1) {
                    res.status(409).json({
                        message: 'this email is already used'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            })
                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'User created'
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    return res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    });
                }
            })
    });

    router.route('/:userid')
        .delete(function(req, res) {
            User.remove({_id : req.params.userId})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message : 'user deleted'
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error : err});
                });
        });

module.exports = router;