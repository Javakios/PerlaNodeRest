const express = require('express');

const router = express.Router();
const carouselController = require('../controllers/carousel');
router.post('/setCarousel',carouselController.setCarousel);
router.post('/getCarousel',carouselController.getCarousel);
module.exports = router;