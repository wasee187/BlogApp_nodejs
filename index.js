const express = require('express');
const expbs = require('express-handlebars');
//require  dot env
require('dotenv').config();
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
//requiring passport
const passport = require('passport');
require('./config/passport').localStrategy(passport);
require('./config/passport').googleStrategy(passport);

//requiring flash message
const flash = require('connect-flash');
const {
  compareValues,
  truncateContent,
  checkArthur,
  formatDate,
} = require('./helpers/hbs');

const app = express();

//requiring database connection function
const { connectDB, url } = require('./config/db');
//requiring connect mongo
const MongoStore = require('connect-mongo');

//calling database connection function
connectDB();
//connecting mongodb with session
const store = MongoStore.create({ mongoUrl: url });

//requiring blogs route
const blogRoutes = require('./routes/blogs');
//requiring page routes
const pageRoutes = require('./routes/pages');
//requiring auth routes
const authRoutes = require('./routes/auth');
//requiring comment routes
const commentRoutes = require('./routes/comment');
//requiring user routes
const userRoutes = require('./routes/users');
//requiring error middleware
const errMiddleware = require('./middleware/errMiddleware');

//handlebar engine declaration
app.engine(
  '.hbs',
  expbs({
    extname: '.hbs',
    helpers: {
      compareValues,
      truncateContent,
      checkArthur,
      formatDate,
    },
  })
);
app.set('view engine', '.hbs');

//************************************middleware**************************

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 60 * 100 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);
//flash message middleware
app.use(flash());
//passport initialize
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.user_id = (req.user && req.user._id) || null;
  res.locals.user_firstName = (req.user && req.user.firstName) || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//************************************Routing part***************************************//

//calling blogs router middleware
app.use('/blogs', blogRoutes);
//route for authentication
app.use('/auth', authRoutes);
//route for user
app.use('/users', userRoutes);
//route for comment
app.use('/blogs/:id/comments', commentRoutes);

//route middleware for all pages
app.use(pageRoutes);

//error middleware route
app.use(errMiddleware);

//creating server and listening the port
app.listen('3000', () => {
  console.log('listening server on port 3000');
});
