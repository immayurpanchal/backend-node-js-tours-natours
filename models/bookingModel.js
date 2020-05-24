const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  paymentId: {
    type: String,
    required: [true, 'Booking must have a paymentId']
  },
  orderId: { type: String, required: [true, 'Booking must have a orderId'] },
  signature: {
    type: String,
    required: [true, 'Booking must have a signature ']
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('tour').populate({ path: 'tour' });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
