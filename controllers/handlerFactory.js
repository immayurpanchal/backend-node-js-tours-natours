const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Modal =>
  catchAsync(async (req, res, next) => {
    const document = await Modal.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document find with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
