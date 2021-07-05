const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
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

const Comment = mongoose.model('Comment', commentSchema);
module.exports = {
  Comment,
  commentSchema,
};
