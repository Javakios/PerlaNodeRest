const express = require('express');
const router = express.Router();
// controller 
const authController = require('../controllers/auth');
router.post('/login',authController.login);
module.exports = router;