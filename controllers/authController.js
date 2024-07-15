const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.signup = asyncHandler(async (req, res, next) => {
  await User.create(req.body);
  res.redirect("/login");
});

exports.login = asyncHandler(async (req, res, next) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    // return res
    // .status(401)
    // .json({ status: "fail", message: "Incorrect username or password" });
    let error = "Invalid Username or Password";
    return res.render("login", { error: error });
  }
  req.session.user = user;
  res.locals.userId = req.session.user.userId;
  let word = req.session.user.name;
  res.locals.name = word.charAt(0).toUpperCase() + word.slice(1);
  res.locals.isAuthenticated = req.session.user;
  res.redirect("/users/forms");
});

exports.protect = asyncHandler(async (req, res, next) => {
  if (req.session.user) {
    console.log(req.session.user);
    next();
  } else {
    return res.render("login", { error: "Unauthorized: Please log in" });
  }
});

exports.logout = (req, res, next) => {
  // logout logic
  req.session.user = null;
  res.redirect("/");
};
