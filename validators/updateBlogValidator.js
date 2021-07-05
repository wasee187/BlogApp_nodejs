const { validationResult } = require('express-validator');

const updateBlogValidator = (req, res, next) => {
  const errors = validationResult(req);
  const id = req.params.id;

  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;
  if (!errors.isEmpty()) {
    return res.render('blogs/edit', {
      title: 'Edit blog',
      errMsg: errors.array()[0].msg,
      blog: {
        id,
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

module.exports = updateBlogValidator;
