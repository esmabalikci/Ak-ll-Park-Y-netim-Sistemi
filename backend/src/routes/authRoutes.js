const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');

// Kullanıcı kayıt endpoint'i
router.post('/register', registerUser);

// Kullanıcı giriş endpoint'i
router.post('/login', loginUser);

// Şifremi unuttum endpoint'i
router.post('/forgot-password', forgotPassword);

module.exports = router;
