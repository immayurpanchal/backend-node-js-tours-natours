const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');

const app = express();

dotenv.config({ path: './config.env' });

// 1) GLOBAL MIDDLEWARES
// Use of morgan middleware
// Provides Logging information of request(s) in terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Try again after an hour'
});

//
app.use('/api', limiter);

// Use of express.json() middleware
app.use(express.json());

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

// If code reaches here means None of the routes matched
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
