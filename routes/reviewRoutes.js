const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

/* 
mergeParams: true requires as to get the access of 
tourId params in /:tourId/reviews path 
*/
const router = express.Router({ mergeParams: true });

// POST /tour/:id/reviews
// POST /reviews
// mergeParams can regonize above both routes

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
