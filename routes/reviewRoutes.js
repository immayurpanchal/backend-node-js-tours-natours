const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

/* 
mergeParams: true requires as to get the access of 
tourId params in /:tourId/reviews path 
*/
const router = express.Router({ mergeParams: true });

// Below this middleware only authorised user can access the routes
router.use(authController.protect);

// POST /tour/:id/reviews
// POST /reviews
// mergeParams can regonize above both routes

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
