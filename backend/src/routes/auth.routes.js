const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// ๐”‘ POST /api/auth/login (เธชเธณเธซเธฃเธฑเธ login)
router.post('/login', authController.login);

module.exports = router;

