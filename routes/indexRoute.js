var express = require("express");
const claimController = require("../controllers/claimController");
const authController = require("../controllers/authController");
var router = express.Router();

/* GET home page. */

router.get("/", function (req, res, next) {
  if (req.session.user) res.redirect("/users/forms");
  else res.render("login", { error: null });
});
router.get("/admin", function (req, res, next) {
  res.render("index", {});
});

// router.get('/login', function (req, res, next) {
//   res.render('login', {});
// });
router.get("/register", function (req, res, next) {
  res.render("register", { error: null });
});

router
  .route("/login")
  .get((req, res, next) => {
    if (req.session.user) res.redirect("/users/forms");
    else res.render("login", { error: null });
  })
  .post(authController.login);

module.exports = router;
