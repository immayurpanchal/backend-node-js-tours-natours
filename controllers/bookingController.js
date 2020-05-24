const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const Razorpay = require('razorpay');
const shortid = require('shortid');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the current book tour
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: 'Invalid Tour'
    });
  }

  // 2) Create checkout session
  const order = await razorpay.orders.create({
    amount: (tour.price * 100).toString(),
    currency: 'INR',
    receipt: shortid.generate(),
    payment_capture: 1
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    order
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // Get current user
  const currentUser = req.user;

  // find bookings by user id
  const bookings = await Booking.find({ user: currentUser });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
