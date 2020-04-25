const express = require('express');
const tourController = require('../controllers/tourController');
const authContrller = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

// Tour Router
const router = express.Router();

// router.param('id', tourController.checkID);

// Review routes
router.use('/:tourId/reviews', reviewRouter);

// Tour Routes
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authContrller.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authContrller.protect,
    authContrller.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// POST /tour/:id/reviews -> Create a given tour review
// GET /tour/:id/reviews -> Get reviews for given tour id
// GET /tour/:id/review/:rid -> Get specific review details

module.exports = router;
