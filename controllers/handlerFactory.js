const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document find with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    // new: true will return the updated document
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!document) {
      return next(new AppError('No document find with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        data: document
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const document = await query;

    if (!document) {
      return next(new AppError('No document find with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { tour: document }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};

    // Get a single tour reviews if tourId is given
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // explain() gives the information about the queried data
    // const document = await features.query.explain();
    const document = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: document.length,
      data: { data: document }
    });
  });
