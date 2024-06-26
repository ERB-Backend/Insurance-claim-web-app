const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A User must have a name"],
  },
  email: {
    type: String,
    required: [true, "A User must have an email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    trim: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
