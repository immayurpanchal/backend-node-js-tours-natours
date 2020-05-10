const multer = require('multer');

const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users'); // it's like next() in express
  },
  filename: (req, file, cb) => {
    // user-userId-TimeStamp.jpg
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

// Allows only images to upload
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

// Image upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // check middlware input from of photo upload
  /* Output:
  {
    fieldname: 'photo',
    originalname: 'Screenshot from 2020-04-19 21-35-41.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: 'public/img/users',
    filename: '6402f363c5945f9ad96ff1fd423215c7',
    path: 'public/img/users/6402f363c5945f9ad96ff1fd423215c7',
    size: 207
  }
  */
  // console.log(req.file);

  // [Object: null prototype] { name: 'Mayur Panchal' }
  // console.log(req.body);

  // 1) Create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword'
      )
    );
  }
  // 2) Filtered out unwanted fields not allowed
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please user /signup instead.'
  });
};

// Do NOT update password with this!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
