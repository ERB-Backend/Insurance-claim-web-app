const User = require("../models/userModel");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {}).then(() => console.log("DB connection successful"));

exports.signup = asyncHandler(async (req, res, next) => {
  await User.create(req.body);
  res.redirect("/login");
});

exports.login = asyncHandler(async (req, res, next) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res
      .status(401)
      .json({ status: "fail", message: "Incorrect username or password" });
    // return res.render("/login", { error: "Invalid Username or Password" });
  }
  req.session.user = user;
  res.render("forms", {});
});
