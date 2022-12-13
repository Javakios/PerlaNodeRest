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
router.post('/updateDataSheet',productsController.updateDataSheet);
router.post('/updateDescription',productsController.updateDescription);
router.post('/updateSingleImage',productsController.updateSingleImage);
router.post('/getColors',productsController.getColors);
router.post('/uploadVideo',productsController.uploadVideo);
router.post('/uploadPdfToProduct',productsController.uploadPdfToProduct);
router.post('/removeSinglePdf',productsController.removeSinglePdf)
router.post('/secondaryImages',productsController.secondaryImages);
router.post('/removeThumbnail',productsController.removeThumb)
router.post('/getSingle',productsController.getSingle);
router.post('/editMosquiSub',productsController.editMosquiDesc)
router.post('/editMosquiDataSheet',productsController.editMosquiDataSheet);
router.post('/editMosquiUrl',productsController.editMosquiUrl);
router.post('/editMosquiImage',productsController.editMosquiImage);
router.post('/isFavorite',productsController.isFavorite);
router.post('/getSubcategory',productsController.getSubcategory);
router.post('/editMosquiOtherImages',productsController.editMosquiOtherImages);
router.post('/removeOtherImages',productsController.removeOtherImages);
// router.post('/lala',productsController.todb);
module.exports = router;