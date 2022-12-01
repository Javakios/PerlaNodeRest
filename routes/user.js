const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/getYpokatastimata',userController.getYpokat);

module.exports = router;