var express = require("express");
const claimController = require("../controllers/claimController");
var router = express.Router();
const Claim = require("../models/claimModel");
/* GET users listing. */

router.route("/").get(function (req, res, next) {
  res.render("profile", {});
});

router.route("/dashboard").get(async (req, res, next) => {
  const claims = await claimController.getAllClaims(req, res);
  res.render("test", { claims: claims });
});

router
  .route("/forms")
  .get(function (req, res, next) {
    res.render("forms", {});
  })
  .post(claimController.createClaim);
module.exports = router;
