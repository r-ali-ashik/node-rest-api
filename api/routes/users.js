const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

router.route('/sign-up')
    .post(userService.singUp);

router.route('/:userid')
    .delete(userService.delete);

router.route('/login')
    .post(userService.login)

module.exports = router;