const express = require('express');
const multer = require('multer')
const userController = require('../controllers/usercontroller');
const authController = require('./../controllers/authcontroller');

const uplaod = multer( {dest: 'public/img/users'})
const Router = express.Router();

Router.post('/login', authController.login)
Router.get('/logout', authController.logout)
Router.post('/signup', authController.signup)
Router.post('/forgotPassword', authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.resetPassword)

// Protects all routes after this middleware
Router.use(authController.protect)

Router.patch('/updateMyPassword', authController.updateMyPassword)
Router.patch('/updateMe', userController.updateUserPhoto, userController.resizeUserPhoto, userController.updateMe)
Router.delete('/deleteMe', userController.deleteMe)
Router.get('/me', userController.getMe, userController.getSpecificUser)

// Restricts all routes after this middleware
Router.use(authController.restrictTo('admin'))

Router.route('/').get(userController.getallUsers).post(userController.createNewUser);

Router
  .route('/:id')
  .get(userController.getSpecificUser)
  .patch(userController.modifyUser)
  .delete(userController.deleteUser);

module.exports = Router;
