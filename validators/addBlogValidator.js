const { validationResult } = require('express-validator');

const addBlogValidator = (req, res, next) => {
  const errors = validationResult(req);
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;
  if (!errors.isEmpty()) {
    return res.render('blogs/new', {
      title: 'Add blog',
      path: '/blogs/new',
      errMsg: errors.array()[0].msg,
      blog: {
        title: req.body.title,
        description: req.body.description,
        allowComments,
        status: req.body.status,
        tags: req.body.tags,
      },
    });
  } else {
    next();
  }
};

module.exports = addBlogValidator;
