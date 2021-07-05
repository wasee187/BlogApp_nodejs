//requiring lodash
const _ = require('lodash');
//requiring mongoose
const mongoose = require('mongoose');
//requiring Blog model
const Blog = require('../models/blogs');
const { Comment } = require('../models/comments');
//require blogs document
const { getBlogsDoc, generateCommentDoc } = require('../helpers/docGenerate');

//all blogs controller
const blogsController = async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({ status: 'public' });
    const context = {
      blogsDocuments: allBlogs.map((blog) => getBlogsDoc(blog)),
    };
    res.render('blogs/index', {
      blogs: context.blogsDocuments,
      title: 'All blogs',
      path: '/blogs',
    });
  } catch (err) {
    next(err);
  }
};

//add new blog form controller
const addBlogFormController = (req, res) => {
  res.render('blogs/new', {
    title: 'Add Blog',
    path: '/blogs/new',
  });
};

//edit blog form controller
const editBlogFormController = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.render('pages/notFound', {
      title: 'Not Found',
    });
  }
  try {
    const blogToEdit = await Blog.findById(id);

    if (blogToEdit) {
      const blog = getBlogsDoc(blogToEdit);
      res.render('blogs/edit', {
        title: 'Edit Blog',
        blog,
      });
    } else {
      res.render('pages/notFound', {
        title: 'Blog Not Found',
      });
    }
  } catch (err) {
    next(err);
  }
};

//single blog controller
const blogController = async (req, res, next) => {
  const id = req.params.id;
  let commentsDoc;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.render('pages/notFound', {
      title: 'Not Found',
    });
  }
  try {
    const blogToShow = await Blog.findById(id).populate('comments');
    //generating comment doc
    if (blogToShow.comments) {
      commentsDoc = blogToShow.comments.map((comment) =>
        generateCommentDoc(comment)
      );
    }

    if (blogToShow) {
      const blog = getBlogsDoc(blogToShow);
      blog.comments = commentsDoc;
      res.render('blogs/show', {
        blog,
        title: blog.title,
      });
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Blog Not Found',
      });
    }
  } catch (err) {
    next(err);
  }
};

//add new blog controller
const addBlogController = async (req, res, next) => {
  req.body.tags = req.body.tags.split(',');
  try {
    const blog = new Blog({
      ...req.body,
      allowComments: req.body.allowComments,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    });

    await blog.save();
    req.flash('success_msg', 'Blog added successfully');
    //redirecting
    res.redirect('/blogs');
  } catch (err) {
    next(err);
  }
};

//update blog controller

const updateBlogController = async (req, res, next) => {
  const id = req.params.id;
  req.body.tags = req.body.tags.split(',');
  const pickedValue = _.pick(req.body, [
    'title',
    'description',
    'allowComments',
    'status',
    'tags',
  ]);

  try {
    const blog = await Blog.findByIdAndUpdate(id, pickedValue);
    if (blog) {
      req.flash('success_msg', 'Blog updated successfully');
      //redirecting to single blog page
      res.redirect(`/blogs/${id}`);
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    next(err);
  }
};

//delete blog controller
const deleteBlogController = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.render('pages/notFound', {
      title: 'Not Found',
    });
  }
  try {
    const blogToDelete = await Blog.findById(id);
    const blog = blogToDelete.remove();
    if (blog) {
      req.flash('success_msg', 'Blog deleted successfully');
      //redirecting
      res.redirect('/blogs');
    } else {
      res.render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  blogsController,
  addBlogFormController,
  editBlogFormController,
  blogController,
  addBlogController,
  updateBlogController,
  deleteBlogController,
};
