//requiring user model
const User = require('../models/user');

//get register controller
const getRegController = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    path: '/auth/register',
  });
};

//get login controller
const getLoginController = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    path: '/auth/login',
  });
};

//post register controller
const postRegisterController = async (req, res) => {
  const user = new User({
    ...req.body,
  });
  await user.save();
  req.flash('success_msg', 'Successfully registered. Please login.');
  res.redirect('/auth/login');
};

//post login controller
const postLoginController = (req, res) => {
  console.log(req.user);
  req.flash('success_msg', 'Successfully logged in');
  res.redirect('/blogs');
};

//get logout controller
const getLogoutController = (req, res) => {
  req.logout();
  req.flash('success_msg', 'Successfully logged out');
  res.redirect('/auth/login');
};
module.exports = {
  getRegController,
  getLoginController,
  postRegisterController,
  postLoginController,
  getLogoutController,
};
