const express = require('express');
const { body } = require('express-validator/check');
// const {body} = require('express-')
const router = express.Router();
// controllers 
const productsController = require('../controllers/products');


router.get('/getProducts',productsController.getProducts);
router.post('/getAllproductsRelated',productsController.getProductsRelated)


module.exports = router;