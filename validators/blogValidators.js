const { check } = require('express-validator');

const blogValidators = () => {
  return [
    check('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be in between 5 to 100 characters')
      .trim(),

    check(
      'description',
      'Description must be less then 20000 characters'
    ).isLength({ max: 20000 }),

    check('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['public', 'private'])
      .withMessage('Please set status public or private only'),

    check('tags', 'Blog must have at least one tag')
      .trim()
      .isLength({ min: 1 }),
  ];
};

module.exports = blogValidators;
