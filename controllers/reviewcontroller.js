const Review = require('./../models/reviewModule');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const Factory = require('./handleFactory');

exports.getAllReviews = Factory.getAll(Review)

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = Factory.getOne(Review)
exports.createReview = Factory.createOne(Review)
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
