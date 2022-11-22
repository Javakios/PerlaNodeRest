const express = require('express');
const { body } = require('express-validator/check');
// const {body} = require('express-')
const router = express.Router();
// controllers 
const productsController = require('../controllers/products');

router.post('/getAllOffers',productsController.getOffers);
router.get('/getProducts',productsController.getProducts);
router.get('/getAllproductsRelated',productsController.getProductsRelated);
router.delete('/deleteOffer',productsController.deleteOffer);
router.get('/favorites',productsController.favorites)
router.get('/fetchCartItems',productsController.fetchCartItems);

module.exports = router;