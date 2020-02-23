const tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime
    // results: tours.length,
    // data: { tours: tours }
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success'
    // data: { tour }
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success'
    // data: {
    //   tour: 'Update tour here...'
    // }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
