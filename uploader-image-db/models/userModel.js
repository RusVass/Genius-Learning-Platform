const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: null,
  },
});

const ImageUser = mongoose.model('ImageUser', userSchema);

module.exports = ImageUser;