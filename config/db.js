const mongoose = require('mongoose');
const config = require('config');

// get this from default.json file - using config pacakge
const db_string = config.get('mongoURI');

const connectDb = async () => {
  // exception handling
  try {
    await mongoose.connect(db_string, {
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log('Mongo DB connected successfully...');
  } catch (error) {
    console.error(error.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDb;
