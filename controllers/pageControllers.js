//home page controller

const homePageController = (req, res) => {
  res.status(200).render('pages/index', {
    title: 'Home Page',
    text: 'Share your thoughts with everyone',
  });
};

//not found controller
const notFoundPageController = (req, res) => {
  res.render('pages/notFound', {
    title: 'Not Found',
  });
};

//about us page controller
const aboutUsPageController = (req, res) => {
  res.render('pages/aboutUs', {
    title: 'About Us',
    path: '/about',
  });
};

module.exports = {
  homePageController,
  notFoundPageController,
  aboutUsPageController,
};
