const express = require('express');
const router = express.Router();

//requiring passport
const passport = require('passport');

//requiring auth controller
const {
  getRegController,
  getLoginController,
  postRegisterController,
  postLoginController,
  getLogoutController,
} = require('../controllers/authControllers');

//requiring validators
const {
  userValidators,
  loginUserValidators,
} = require('../validators/userValidators');
const {
  userValidator,
  loginUserValidation,
} = require('../validators/userValidator');

//requiring middleware
const { ensureGuest } = require('../middleware/authMiddleware');

//register route
router.get('/register', ensureGuest, getRegController);

//login router
router.get('/login', ensureGuest, getLoginController);

//post register route
router.post(
  '/register',
  userValidators(),
  userValidator,
  postRegisterController
);

//post login route
router.post(
  '/login',
  loginUserValidators(),
  loginUserValidation,
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
  }),
  postLoginController
);

//logout route
router.get('/logout', getLogoutController);

//get google login routes
router.get(
  '/google',
  ensureGuest,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//google callback routes
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/blogs');
  }
);
module.exports = router;
