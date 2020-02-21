const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    // console.log(con.connections);
    console.log('Connection Successful');
  });

const tourSchema = new mongoose.Schema({
  name: {
    required: [true, 'A tour must have name'],
    type: String,
    unique: true
  },
  rating: {
    required: true,
    type: Number
  },
  price: {
    required: [true, 'A tour must have price'],
    type: Number
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 297,
  rating: 4.5
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log(err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on ${port}`);
});
