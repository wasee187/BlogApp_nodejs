const mongoose = require('mongoose');

const url = process.env.DB_LOCAL;
//connecting database
async function connectDB() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('Database connection successful');
  } catch (err) {
    console.log(err);
  }
}

module.exports = { connectDB, url };
