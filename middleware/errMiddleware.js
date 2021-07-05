//error page middleware

const errMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(500).render('pages/error');
};

module.exports = errMiddleware;
