//requiring user model
const User = require('../models/user');
//requiring doc generate
const { getBlogsDoc, generateUserDoc } = require('../helpers/docGenerate');

//require lodash
const _ = require('lodash');

//get user profile controller

const getUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const userDoc = generateUserDoc(user);
      res.render('users/user_profile', {
        title: `Profile of ${user.firstName}`,
        path: '/users/me',
        user: userDoc,
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

//user edit form controller
const getUserEditFormController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const userDoc = generateUserDoc(user);
      res.render('users/edit_user', {
        title: `Edit Profile of ${user.firstName}`,
        path: '/users/me',
        user: userDoc,
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

//update user controller
const updateUserController = async (req, res) => {
  try {
    const pickedValue = _.pick(req.body, ['firstName', 'lastName']);
    console.log(pickedValue);
    const user = await User.findByIdAndUpdate(req.user._id, pickedValue);
    if (user) {
      req.flash('success_msg', 'Your information updated successfully');
      res.redirect('/users/me');
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

//getting specific user blogs controller
const getUserBlogsController = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate('blogs');

    if (user) {
      const blogDoc = user.blogs.map((blog) => getBlogsDoc(blog));
      const publicBlog = blogDoc.filter((blog) => blog.status === 'public');
      res.render('blogs/index', {
        title: `All Blogs by ${user.firstName}`,
        firstName: user.firstName,
        blogs: publicBlog,
        userBlog: true,
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

//dashboard controller
const getDashboardController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('blogs');
    if (user) {
      const blogDoc = user.blogs.map((blog) => getBlogsDoc(blog));
      console.log(blogDoc);
      res.render('users/dashboard', {
        title: `dashboard of ${user.firstName}`,
        path: '/users/me/blogs',
        blog: blogDoc,
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//delete user controller
const deleteUserController = async (req, res) => {
  try {
    const user = await req.user.remove();
    if (user) {
      req.logout();
      req.flash('success_msg', 'Your information deleted successfully');
      res.redirect('/blogs');
    }
  } catch (err) {
    req.flash('error_msg', 'Problem occurred in deleting profile');
    res.redirect('back');
  }
};
module.exports = {
  getUserProfileController,
  getUserEditFormController,
  updateUserController,
  getUserBlogsController,
  getDashboardController,
  deleteUserController,
};
