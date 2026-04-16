const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Kullanıcı kayıt endpoint'i
router.post('/register', registerUser);

// Kullanıcı giriş endpoint'i
router.post('/login', loginUser);

module.exports = router;
