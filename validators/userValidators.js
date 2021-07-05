//require user model
const User = require('../models/user');
const { check } = require('express-validator');

const userValidators = () => {
  return [
    check('firstName')
      .notEmpty()
      .withMessage('First Name is required')
      .isLength({ min: 4, max: 15 })
      .withMessage('First name must be in between 4 to 15 characters')
      .trim(),
    check('lastName')
      .notEmpty()
      .withMessage('last Name is required')
      .isLength({ min: 4, max: 15 })
      .withMessage('last name must be in between 4 to 15 characters')
      .trim(),
    check('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email')
      .trim()
      .normalizeEmail(),
    check('email').custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('Email is already in use');
      } else {
        return true;
      }
    }),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 4, max: 15 })
      .withMessage('Password must be in between 4 to 15 characters')
      .not()
      .isIn(['12345', 'god123', 'password'])
      .withMessage('Do not use common word as the password'),
    check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm Password is required')
      .custom((pass, { req }) => {
        if (pass !== req.body.password) {
          throw new Error('Password must be same');
        } else {
          return true;
        }
      }),
  ];
};
const updateUserValidators = () => {
  return [
    check('firstName')
      .notEmpty()
      .withMessage('First Name is required')
      .isLength({ min: 4, max: 15 })
      .withMessage('First name must be in between 4 to 15 characters')
      .trim(),
    check('lastName')
      .notEmpty()
      .withMessage('last Name is required')
      .isLength({ min: 4, max: 15 })
      .withMessage('last name must be in between 4 to 15 characters')
      .trim(),
  ];
};
const loginUserValidators = () => {
  return [
    check('email')
      .notEmpty()
      .withMessage('Email is require')
      .isEmail()
      .withMessage('Email is invalid'),
    check('password').notEmpty().withMessage('Password is required'),
  ];
};

module.exports = { userValidators, loginUserValidators, updateUserValidators };
