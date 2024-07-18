var express = require("express");
const claimController = require("../controllers/claimController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
var router = express.Router();

//------ steve start ------
//1.0.1
router.route("/allClaims").get(async (req, res, next) => {
  try {
    const claims = await claimController.allClaims(req, res);
    if (claims) {
      let returnJson = req.query.hasOwnProperty("returnJson")
        ? Boolean(Number(req.query.returnJson))
        : false;
      if (returnJson) {
        res.json(claims);
      } else {
        res.render("index", { claims: claims });
      }
    } else {
      res.send("Fail");
    }
  } finally {
  }
});
//1.0.2.1
router.route("/claimByObjectId").get(async (req, res, next) => {
  try {
    console.log("claimByObjectId  req.query : ", req.query);
    const { objectId } = req.query;
    console.log("objectId : ", objectId);
    const claim = await claimController.claimByObjectId(req, res);
    console.log("claim : ", claim);
    if (claim) {
      res.json(claim);
    } else {
      res.send("objectId : " + req.query.objectId + "  not found");
    }
  } finally {
  }
});
//1.0.2.2
router.route("/claimByObjectIdUpdateStatus").get(async (req, res, next) => {
  try {
    const claim = await claimController.claimByObjectIdUpdateStatus(req, res);
    console.log("claim : ", claim);

    if (claim) {
      //console.log('_id : ', claim._id);
      //res.send('policyNumber : ' + req.query.policyNumber + ' found');
      res.json(claim);
    } else {
      res.send("objectId : " + req.query.objectId + "  not found");
    }
  } finally {
  }
});

module.exports = router;
