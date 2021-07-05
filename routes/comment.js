const express = require('express');
const router = express.Router({ mergeParams: true });
//import isAuth middleware
const { isAuth, checkCommentOwner } = require('../middleware/authMiddleware');
//importing controller
const {
  postCommentController,
  editCommentController,
  updateCommentController,
  deleteCommentController,
} = require('../controllers/commentControllers');

//importing comment validator
const commentValidators = require('../validators/commentValidators');
const {
  commentValidator,
  updateCommentValidator,
} = require('../validators/commentValidator');

//adding new comment
router.post(
  '/',
  isAuth,
  commentValidators(),
  commentValidator,
  postCommentController
);

//edit form
router.get(
  '/:comment_id/edit',
  isAuth,
  checkCommentOwner,
  editCommentController
);
//update comment
router.put(
  '/:comment_id/update',
  isAuth,
  checkCommentOwner,
  commentValidators(),
  updateCommentValidator,
  updateCommentController
);

//delete comment
router.delete(
  '/:comment_id',
  isAuth,
  checkCommentOwner,
  deleteCommentController
);

module.exports = router;
