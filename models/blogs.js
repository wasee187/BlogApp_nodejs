const mongoose = require('mongoose');
//requiring comment model
const { Comment } = require('./comments');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minLength: [5, 'Title must have minimum 5 characters'],
      maxLength: [100, 'Title must have maximum 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxLength: [20000],
    },
    allowComments: {
      type: Boolean,
      required: [true, 'AllowComments is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['public', 'private'],
        message: ['Please set public or private in status field'],
      },
    },
    tags: [
      {
        type: String,
        required: [true, 'Blog must have at least one tag'],
      },
    ],
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      firstName: String,
      lastName: String,
    },
  },
  {
    timestamps: true,
  }
);

//virtual schema
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
});

//deleting comment associate with deleted blog
blogSchema.pre('remove', async function (next) {
  const blog = this;
  const id = blog._id;
  await Comment.deleteMany({
    blog: id,
  });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
