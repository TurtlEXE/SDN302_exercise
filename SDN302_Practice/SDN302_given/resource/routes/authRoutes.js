const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/tokens', authController.login);
router.post('/login', authController.login);

module.exports = router;
