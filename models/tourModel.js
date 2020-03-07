const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      required: [true, 'A tour must have name'],
      type: String,
      unique: true,
      trim: true
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
      required: [true, 'A tour must have a difficulty']
    },
    ratingAverage: {
      type: Number,
      default: 4.5
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      required: [true, 'A tour must have price'],
      type: Number
    },
    priceDiscount: Number,
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
    }
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
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
