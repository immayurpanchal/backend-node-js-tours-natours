const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception 🔥 Shutting Down...!');
  // Gracefully Shutting Down the server.
  // Gracefully means Completing on going processes.
  process.exit(1);
});

const app = require('./app');

// console.log(process.env);

/* const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
); */

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connection Successful');
  });

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandler Rejection 🔥 Shutting Down...!');
  // Gracefully Shutting Down the server.
  // Gracefully means Completing on going processes.
  server.close(() => {
    process.exit(1);
  });
});
