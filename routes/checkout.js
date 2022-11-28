const express = require('express');
const router = express.Router();
// controller
const checkoutController = require('../controllers/checkout');

router.post('/checkout',checkoutController.checkout);
module.exports = router;