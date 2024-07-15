var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");

var indexRouter = require("./routes/indexRoute");
var usersRouter = require("./routes/usersRoute");
const authController = require("./controllers/authController");

const { addUserInfo } = require("./utils/middleware");
var app = express();

app.use(
  session({ secret: "secret string", resave: false, saveUninitialized: true })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.locals.moment = require("moment");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", addUserInfo, usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render("error");

  if (err.name === "ValidationError" && req.session.user) {
    // Handle validation errors
    handleValidationError(err, req);
    console.log("🔥🔥🔥🔥🔥🔥 Error Middleware", req.session.user);
    res.redirect("/users");
    next();
  }
  if (err.name === "ValidationError" && !req.session.user) {
    handleValidationError(err, req);
    console.log("🔥🔥🔥🔥🔥🔥 Error Middleware", err);
    res.redirect("/users");
    next();
  }

  function handleValidationError(err, req) {
    // Extract error messages
    const errorMessages = Object.values(err.errors).map(
      (error) => error.message
    );

    // Join all error messages into a single string
    const errorMessage = errorMessages.join(". ");

    // Store the error message in the session
    if (!req.session.user) {
      let error = errorMessage;
      return res.render("login", { error: error });
    } else {
      req.session.user.error = errorMessage;
    }
  }

  // Log the error
  console.error(err.stack);

  // Render an error page
  res.status(500).render("error", { error: err });
});

module.exports = app;
