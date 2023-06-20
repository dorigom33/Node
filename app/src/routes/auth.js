const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/signup', (req, res) => {
  res.render('auth/signup.ejs');
});

router.post('/signup', authController.signup, (req, res) => {
  // 회원가입이 완료된 후 /login 페이지로 리다이렉트
  res.redirect('/login');
});

// Google 회원가입 관련 라우트는 별도로 렌더링하지 않습니다.
router.post('/signup/google', authController.signupWithGoogle);

router.get('/login', (req, res) => {
  res.render('auth/login.ejs');
});

router.post('/login', authController.login, (req, res) => {
  // 로그인이 완료된 후 /main 페이지로 리다이렉트
  res.redirect('/main');
});

// Google 로그인 관련 라우트는 별도로 렌더링하지 않습니다.
router.post('/login/google', authController.loginWithGoogle);

module.exports = router;
