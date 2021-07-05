const { validationResult } = require('express-validator');
//requiring user model
const User = require('../models/user');
//user validator function
const userValidator = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    res.render('auth/register', {
      title: 'Register',
      path: '/auth/register',
      errMsg: error.array()[0].msg,
      userReg: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  } else {
    next();
  }
};

//login user validation
const loginUserValidation = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.render('auth/login', {
      title: 'Login',
      path: '/auth/login',
      errMsg: error.array()[0].msg,
      userLog: {
        email: req.body.email,
      },
    });
  } else {
    next();
  }
};

//update user validator
const updateUserValidator = async (req, res, next) => {
  const error = validationResult(req);
  try {
    const user = User.findById(req.user._id);
    if (!error.isEmpty()) {
      res.render('users/edit_user', {
        title: `Edit Profile of ${user.firstName}`,
        errMsg: error.array()[0].msg,
        user: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        path: '/users/me',
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};
module.exports = { userValidator, loginUserValidation, updateUserValidator };
