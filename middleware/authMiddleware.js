//requiring blog model
const Blog = require('../models/blogs');
const { Comment } = require('../models/comments');

const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    req.flash('error_msg', 'Please login to perform this action');
    res.redirect('/auth/login');
  }
};

const checkOwnership = async (req, res, next) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (blog) {
    if (blog.user.id.equals(req.user._id)) {
      next();
    } else {
      req.flash('error_msg', 'You do not have permission for this action');
      res.redirect('back');
    }
  } else {
    req.flash('error_msg', 'Blog not found');
    res.redirect('back');
  }
};

const checkCommentOwner = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  const comment = await Comment.findById(comment_id);
  if (comment) {
    if (comment.user.id.equals(req.user._id)) {
      next();
    } else {
      req.flash('error_msg', 'You do not have permission for this action');
      res.redirect('back');
    }
  } else {
    req.flash('error_msg', 'Comment not found');
    res.redirect('back');
  }
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/users/me/blogs');
  } else {
    next();
  }
};
module.exports = { isAuth, checkOwnership, checkCommentOwner, ensureGuest };
