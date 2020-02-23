const mongoose = require('mongoose');
const app = require('./app');

// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on ${port}`);
});
