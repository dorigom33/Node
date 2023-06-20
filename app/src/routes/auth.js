const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const mypageController = require('../controller/mypageController');

router.get('/signup', (req, res) => {
  res.render('auth/signup.ejs');
});

router.post('/signup', authController.signup, (req, res) => {
  // 회원가입이 완료된 후 /login 페이지로 리다이렉트
  res.redirect('/login');
});


router.post('/signup/google', authController.signupWithGoogle);

router.get('/login', (req, res) => {
  res.render('auth/login.ejs');
});

router.post('/login', authController.login, (req, res) => {
  // 로그인이 완료된 후 /main 페이지로 리다이렉트
  res.redirect('/main');
});

router.post('/login/google', authController.loginWithGoogle);


router.get('/mypage', (req, res) => {
  res.render('auth/mypage.ejs');
});

router.post('/mypage', mypageController.updateMypage);

module.exports = router;
