const express = require('express');
const tourController = require('../controllers/tourcontroller');
const authController = require('./../controllers/authcontroller');
const reviewRouter = require('./reviewroutes');

const Router = express.Router();

Router.use('/:tourId/reviews', reviewRouter);

Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/monthly-plan/:year').get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getTourPlans,
);
Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAlltours,
);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin)
Router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

Router.route('/')
  .get(tourController.getAlltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createNewtour,
  );

Router.route('/:id')
  .get(tourController.getSpecifictour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.modifyTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = Router;
