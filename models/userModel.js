const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "A User must have a userId"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "A User must have a name"],
    },
    // email: {
    //   type: String,
    //   required: [true, "A User must have an email address"],
    //   unique: true,
    //   lowercase: true,
    //   validate: [validator.isEmail, "Please provide a valid email"],
    //   trim: true,
    // },
    // photo: String,
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
        message: "Passwords are not the same!",
      },
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);

//   this.passwordConfirm = undefined;
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return (await userPassword) === candidatePassword;
  // return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
