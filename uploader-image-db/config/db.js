const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Mongo connection error:', error);
  });
