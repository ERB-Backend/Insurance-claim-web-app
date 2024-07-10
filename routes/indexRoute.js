var express = require("express");
const claimController = require("../controllers/claimController");
const authController = require("../controllers/authController");
var router = express.Router();

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("login", {});
});
router.get("/admin", function (req, res, next) {
  res.render("index", {});
});

// router.get('/login', function (req, res, next) {
//   res.render('login', {});
// });
router.get("/register", function (req, res, next) {
  res.render("register", {});
});

router
  .route("/login")
  .get((req, res, next) => {
    if (req.session.user) res.render("forms", {});
    else res.render("login", {});
  })
  .post(authController.login);

module.exports = router;
