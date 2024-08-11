const express = require('express');
const reviewController = require('./../controllers/reviewcontroller');
const authController = require('./../controllers/authcontroller');

const Router = express.Router({ mergeParams: true });

Router.use(authController.protect)

Router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

Router.route('/:id')
  .delete(reviewController.deleteReview)
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
  .get(authController.restrictTo('user', 'admin'), reviewController.getReview);

module.exports = Router;
