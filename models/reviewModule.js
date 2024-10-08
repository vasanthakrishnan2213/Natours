const mongoose = require('mongoose');
const Tour = require('./tourModle');
const User = require('./userModle');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cannot be empty!'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      max: [5, 'Ratings must be equal or less than 5'],
      min: [1, 'Ratings must be equal or grater than 1'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calaAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if(stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calaAverageRatings(this.tour);
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne()
  next()
})

reviewSchema.post(/^findOneAnd/, async function() {
  this.r.constructor.calaAverageRatings(this.r.tour)
})

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
