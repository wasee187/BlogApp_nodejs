//requiring models
const Blog = require('../models/blogs');
const { Comment } = require('../models/comments');

//requiring lodash
const _ = require('lodash');
//requiring doc generate
const { getBlogsDoc, generateCommentDoc } = require('../helpers/docGenerate');

//post comment controller
const postCommentController = async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id);
    if (blog) {
      const comment = new Comment({
        ...req.body,
        blog: blog.id,
        user: {
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
      });

      //saving comment
      await comment.save();

      //saving blog
      await blog.save();

      req.flash('success_msg', 'Comment Added');
      //redirecting
      res.redirect(`/blogs/${id}`);
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

////edit comment form
const editCommentController = async (req, res) => {
  const id = req.params.id;
  const comment_id = req.params.comment_id;
  try {
    const getBlog = await Blog.findById(id);

    if (getBlog) {
      const blog = getBlogsDoc(getBlog);
      const commentToEdit = await Comment.findById(comment_id);
      const comment = generateCommentDoc(commentToEdit);
      res.render('comments/edit', {
        title: 'Edit Your Comment',
        blog,
        comment,
      });
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//update comment
const updateCommentController = async (req, res) => {
  const id = req.params.id;
  const comment_id = req.params.comment_id;
  const pickedValue = _.pick(req.body, ['text']);
  try {
    const blog = await Blog.findById(id);
    if (blog) {
      await Comment.findByIdAndUpdate(comment_id, pickedValue);

      req.flash('success_msg', 'Comment Updated');
      //redirecting
      res.redirect(`/blogs/${id}`);
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//delete comment controller
const deleteCommentController = async (req, res) => {
  const id = req.params.id;
  const comment_id = req.params.comment_id;
  try {
    const blog = await Blog.findById(id);
    if (blog) {
      //delete comment
      await Comment.findByIdAndDelete(comment_id);

      req.flash('success_msg', 'Comment Deleted');
      //redirecting
      res.redirect(`/blogs/${id}`);
    } else {
      res.render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};
module.exports = {
  postCommentController,
  editCommentController,
  updateCommentController,
  deleteCommentController,
};
