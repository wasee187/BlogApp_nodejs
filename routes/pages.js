const express = require('express');
const router = express.Router();

//requiring page controller
const {
  homePageController,
  notFoundPageController,
  aboutUsPageController,
} = require('../controllers/pageControllers');
//requiring middleware
const { ensureGuest } = require('../middleware/authMiddleware');

//route for homepage
router.get('/', ensureGuest, homePageController);

//route for about us page
router.get('/about', aboutUsPageController);
//route for no found
router.get('*', notFoundPageController);

module.exports = router;
