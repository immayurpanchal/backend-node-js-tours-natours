const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

dotenv.config({ path: './config.env' });

// Use of morgan middleware
// Provides Logging information of request(s) in terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'failed';
  err.statusCode = 404;

  /* 
  => If next() contains any arg, it will automatically assumes that whatever is passed 
  is gonna be an error. That rule applies to any middleware function.
  => If next(args) will be called then it will bypass all the middlware and call the error handling 
  middleware
  */
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
