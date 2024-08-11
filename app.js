const express = require('express');
const fs = require('fs');
const babel = require('@babel/polyfill');
const morgan = require('morgan');
const tourRouter = require('./routes/tourroutes');
const usersRouter = require('./routes/userroutes');
const reviewRouter = require('./routes/reviewroutes');
const bookingRouter = require('./routes/bookingroutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorcontroler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const path = require('path');
const app = express();
// Start express app
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global middlewares

//  Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//  set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://js.stripe.com',
          'https://api.mapbox.com',
          "'blob:'", // Add this line
        ],
        workerSrc: ["'self'", 'blob:'], // Add this line
        connectSrc: [
          "'self'",
          'https://api.mapbox.com',
          'ws://127.0.0.1:60348',
        ],
        imgSrc: ["'self'", 'data:'],
      },
    },
  }),
);

app.use(compression());
//  Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//  Limitng requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip, please try again in an hour',
});
app.use('/api', limiter);

//  Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//  Data sanitization against noSQL querry injection
app.use(mongoSanitize());

//  Data sanitization against xss
app.use(xss());

// prevents parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//  test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl} on this server!`);
  err.status = 'failed';
  err.statusCode = 404;
  next(err);

  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
