
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.singUp = function (req, res) {
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
}

exports.delete = function (req, res) {
    User.remove({
        _id: req.params.userId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'user deleted'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.login = function (req, res) {
    User.find({
        email: req.body.email
    })
        .exec()
        .then(users => {
            if (users.length < 1) {
                res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: users[0].email,
                        userId: users[0]._id
                    },
                        "secret", {
                            expiresIn: "1h"
                        }
                    );

                    res.status(200).json({
                        token: token,
                        message: 'Auth successful'
                    });
                } else {
                    res.status(401).json({
                        message: 'Auth failed'
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}