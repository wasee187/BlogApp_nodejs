const { validationResult } = require('express-validator');

//requiring blog model
const Blog = require('../models/blogs');
const { Comment } = require('../models/comments');
//requiring doc generate
const { getBlogsDoc, generateCommentDoc } = require('../helpers/docGenerate');

const commentValidator = async (req, res, next) => {
  let commentsDoc;
  const errors = validationResult(req);
  const id = req.params.id;

  if (!errors.isEmpty()) {
    try {
      const blogToShow = await Blog.findById(id).populate('comments');
      //generating comment doc
      if (blogToShow.comments) {
        commentsDoc = blogToShow.comments.map((comment) =>
          generateCommentDoc(comment._id, comment.text)
        );
      }
      if (blogToShow) {
        const blog = getBlogsDoc(
          blogToShow._id,
          blogToShow.title,
          blogToShow.description,
          blogToShow.allowComments,
          blogToShow.status,
          blogToShow.tags,
          commentsDoc
        );

        return res.render('blogs/show', {
          title: blog.title,
          errMsg: errors.array()[0].msg,
          blog,
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
  } else {
    next();
  }
};

const updateCommentValidator = async (req, res, next) => {
  const errors = validationResult(req);
  const blog_id = req.params.id;
  const comment_id = req.params.comment_id;
  if (!errors.isEmpty()) {
    try {
      const blogDoc = await Blog.findById(blog_id);

      if (blogDoc) {
        const blog = getBlogsDoc(blogDoc.id, blogDoc.title);
        const commentDoc = await Comment.findById(comment_id);
        const comment = generateCommentDoc(commentDoc.id, commentDoc.text);
        return res.render('comments/edit', {
          title: 'Edit Your Comment',
          errMsg: errors.array()[0].msg,
          blog,
          comment,
        });
      }
    } catch (err) {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } else {
    next();
  }
};

module.exports = { commentValidator, updateCommentValidator };
