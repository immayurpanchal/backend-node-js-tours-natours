const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/me').get(bookingController.getMyBookings);

router
  .route('/checkout-session/:tourId')
  .get(bookingController.getCheckoutSession);

// router.use(authController.restrictTo('lead-guide', 'admin'));

router
  .route('/')
  .get(
    authController.restrictTo('lead-guide', 'admin'),
    bookingController.getAllBookings
  )
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
