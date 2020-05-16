const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

/* 
mergeParams: true requires as to get the access of 
tourId params in /:tourId/reviews path 
*/
const router = express.Router();

router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

module.exports = router;
