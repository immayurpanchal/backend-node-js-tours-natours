const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    required: [true, 'A tour must have name'],
    type: String,
    unique: true
  },
  rating: {
    required: true,
    type: Number
  },
  price: {
    required: [true, 'A tour must have price'],
    type: Number
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
