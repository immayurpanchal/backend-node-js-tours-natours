const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const authController = require('../controllers/authController');

// User Router
const router = express.Router();

// User Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
