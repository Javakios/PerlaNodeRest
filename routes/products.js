const express = require('express');
const { body } = require('express-validator/check');
// const {body} = require('express-')
const router = express.Router();
// controllers 
const productsController = require('../controllers/products');

router.post('/getAllOffers',productsController.getOffers);
router.get('/getProducts',productsController.getProducts);
router.post('/getAllproductsRelated',productsController.getProductsRelated);
router.post('/deleteOffer',productsController.delteOffer);

module.exports = router;