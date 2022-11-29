const express = require('express');
const { body } = require('express-validator/check');
// const {body} = require('express-')
const router = express.Router();
// controllers 
const productsController = require('../controllers/products');
router.post('/addToCart',productsController.addToCart);
router.post('/getAllOffers',productsController.getOffers);
router.get('/getProducts',productsController.getProducts);
router.get('/getAllproductsRelated',productsController.getProductsRelated);
router.delete('/deleteOffer',productsController.deleteOffer);
router.get('/favorites',productsController.favorites)
router.post('/fetchCartItems',productsController.fetchCartItems);
router.get('/seeEarlier',productsController.seeEarlier);
router.get('/findMosquiProduct',productsController.findMosquiProduct);
router.get('/findRelatedProducts',productsController.findRelatedProducts);
router.post('/removeCartItem',productsController.removeCartItem);
router.post('/addProductBasedOnGrouping',productsController.addProductBasedOnGrouping)
router.post('/search',productsController.search);
router.post('/getSeeEarlier',productsController.getSeeEarlier);
router.post('/offers',productsController.offers);
router.post('/homepageOffer',productsController.homeOffer);
router.post('/getAllSuggested',productsController.getSugg);
router.post('/offersByCategory',productsController.offersByCategory);

module.exports = router;