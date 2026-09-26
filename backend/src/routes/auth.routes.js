const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// 🔑 POST /api/auth/login (สำหรับ login)
router.post('/login', authController.login);

module.exports = router;