const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // HTTP Parameter Pollution
const cors = require('cors');
const app = express();

dotenv.config({ path: './config.env' });

// 1) GLOBAL MIDDLEWARES
app.use(cors());

// Set security http headers
app.use(helmet());

// Use of morgan middleware
// Provides Logging information of request(s) in terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Try again after an hour'
});

// Limit the API call from same IP
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// Max limit to send data on the server is 10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution
/*
{{URL}}api/v1/tours?sort=price&sort=duration
Express will create an array of sort Query Params 
and throw error because of our logic won't work there
 */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serve static files
app.use(express.static(`${__dirname}/public`));

// Create a custom middleware
app.use((req, res, next) => {
  // Middleware function by default get next as a third argument
  console.log('Hello from Middleware');
  next(); // Responsible to call next middleware
});

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

// Routers

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// If code reaches here means None of the routes matched
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
