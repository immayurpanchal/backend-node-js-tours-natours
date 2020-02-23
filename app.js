const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

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

module.exports = app;
