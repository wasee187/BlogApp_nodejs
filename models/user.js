const mongoose = require('mongoose');
//requiring bcryptjs
const bcrypt = require('bcryptjs');

//requiring blog and comment model
const Blog = require('./blogs');
const { Comment } = require('./comments');

const userSchema = mongoose.Schema({
  googleID: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: [15, 'FirstName must be less than 15 characters'],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: [15, 'LastName must be less than 15 characters'],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator(v) {
        return v.match(
          /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        );
      },
    },
  },
  password: {
    type: String,
    required: true,
    maxLength: 25,
    minLength: 6,
    validate: {
      validator(v) {
        const passArray = ['12345', 'god123', 'password'];
        const isMatch = passArray.some((pass) => v.includes(pass));
        if (isMatch) {
          return false;
        }
      },
    },
  },
});

//virtual schema for blogs
userSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'user.id',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

//hashing password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } else {
    next();
  }
});

//deleting blogs and comment before deleting user
userSchema.pre('remove', async function (next) {
  const user = this;
  const id = user._id;
  await Blog.deleteMany({
    'user.id': id,
  });
  await Comment.deleteMany({
    'user.id': id,
  });
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
