const { check } = require('express-validator');

const commentValidators = () => {
  return [
    check('text')
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ max: 1000 })
      .withMessage('Comment must be with is 1000 characters'),
  ];
};

module.exports = commentValidators;
