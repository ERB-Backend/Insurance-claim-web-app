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
    return res
      .status(401)
      .json({ status: "fail", message: "Incorrect username or password" });
    // return res.render("/login", { error: "Invalid Username or Password" });
  }
  req.session.user = user;
  res.locals.userId = req.session.user.userId;
  res.locals.name = req.session.user.name;
  res.locals.isAuthenticated = !!req.session.user;
  res.render("forms", {});
});

exports.protect = asyncHandler(async (req, res, next) => {
  if (req.session.user) {
    console.log(req.session.user);
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Please log in" });
  }
});

exports.logout = (req, res, next) => {
  // logout logic
  req.session.user = null;

  //   req.session.save(function (err) {
  //     if (err) next(err)

  //     req.session.regenerate(function (err) {
  //       if (err) next(err)
  res.redirect("/");
  // })
  //   })
};
