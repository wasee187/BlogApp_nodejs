const express = require('express');

const router = express.Router();

//requiring middleware
const { isAuth } = require('../middleware/authMiddleware');

//requiring controllers
const {
  getUserProfileController,
  getUserEditFormController,
  updateUserController,
  getUserBlogsController,
  getDashboardController,
  deleteUserController,
} = require('../controllers/userControllers');

//requiring validations for user
const { updateUserValidator } = require('../validators/userValidator');
const { updateUserValidators } = require('../validators/userValidators');

//get profile routes
router.get('/me', isAuth, getUserProfileController);

//get edit user form
router.get('/me/edit', isAuth, getUserEditFormController);

//update user information route
router.put(
  '/me',
  isAuth,
  updateUserValidators(),
  updateUserValidator,
  updateUserController
);
//deleting profile
router.delete('/me', isAuth, deleteUserController);
//get dashboard for user
router.get('/me/blogs', isAuth, getDashboardController);
//get specific user blogs
router.get('/:id/blogs', getUserBlogsController);

module.exports = router;
