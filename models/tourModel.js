const mongoose = require('mongoose');
const User = require('../models/userModel');
// const validator = require('validator');
// const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      required: [true, 'A tour must have name'],
      type: String,
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have <= 40 characters'],
      minlength: [10, 'A tour name must have >= 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Ratings must be below 5.0']
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      required: [true, 'A tour must have price'],
      type: Number
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this keyword points to new created document. It won't work on update
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJSON - Below
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number // Day of the tour on which people will go to that location
      }
    ],
    guides: Array
  },
  {
    // To view virtual properties, it must explicitely defined
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DOCUMENT MIDDLEWARE
// Runs before .save() and .create(). It doesn't work on .insertMany()
// pre() and post() are called hooks.
/* tourSchema.pre('save', function(next) {
  console.log(this); // Show the current document object before Saving
  this.slug = slugify(this.name, { lower: true });
  next();
}); */

/* tourSchema.pre('save', function(next) {
  console.log('Will Save the document...');
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
}); */

tourSchema.pre('save', async function(next) {
  /* 
  guides will become an Array of promises as .map() 
  contains async function which returns promoise 
  */
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

// We can't use virtual property to Query because it doesn't exist in DB.
tourSchema.virtual('durationWeeks').get(function() {
  // Using normal function because of this keyword
  return this.duration / 7;
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  /* this keyword now points at the current Query,
  not the current document */
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  // console.log(this); // Points to current aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
