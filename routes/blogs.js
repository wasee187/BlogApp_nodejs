const express = require('express');
const router = express.Router();

//requiring blog validators
const blogValidators = require('../validators/blogValidators');

//requiring add blog validator
const addBlogValidator = require('../validators/addBlogValidator');
//requiring update blog validator
const updateBlogValidator = require('../validators/updateBlogValidator');

//requiring controller
const {
  blogsController,
  addBlogFormController,
  editBlogFormController,
  blogController,
  addBlogController,
  updateBlogController,
  deleteBlogController,
} = require('../controllers/blogControllers');

//requiring isAuth middleware
const { isAuth, checkOwnership } = require('../middleware/authMiddleware');

//route for all blogs
router.get('/', blogsController);

//route for adding blog form
router.get('/new', isAuth, addBlogFormController);

//route for edit blog post form
router.get('/:id/edit', isAuth, checkOwnership, editBlogFormController);
//route for single blog
router.get('/:id', blogController);

//add blog post route
router.post('/', isAuth, blogValidators(), addBlogValidator, addBlogController);

//update blog post route
router.put(
  '/:id',
  isAuth,
  checkOwnership,
  blogValidators(),
  updateBlogValidator,
  updateBlogController
);

//route for delete blog
router.delete('/:id', isAuth, checkOwnership, deleteBlogController);

module.exports = router;
