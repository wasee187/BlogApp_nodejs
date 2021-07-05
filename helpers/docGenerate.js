//function for getting blog's collection
const getBlogsDoc = ({
  _id,
  title,
  description,
  allowComments,
  status,
  tags,
  user,
  createdAt,
  comments,
}) => {
  return {
    _id,
    title,
    description,
    allowComments,
    status,
    tags,
    user,
    createdAt,
    comments,
  };
};

const generateCommentDoc = ({ _id, text, user, createdAt }) => {
  return {
    _id,
    text,
    user,
    createdAt,
  };
};

const generateUserDoc = ({ _id, firstName, lastName, email, password }) => {
  return {
    _id,
    firstName,
    lastName,
    email,
    password,
  };
};
module.exports = { getBlogsDoc, generateCommentDoc, generateUserDoc };
