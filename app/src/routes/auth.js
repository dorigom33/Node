const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');


router.get('/signup', (req, res) => {
    res.render('auth/signup.ejs');
});

router.post('/signup', authController.signup);

router.get('/login', (req, res) => {
    res.render('auth/login.ejs');
});

router.post('/login', authController.login);

module.exports = router;