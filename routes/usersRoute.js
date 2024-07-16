var express = require("express");
const claimController = require("../controllers/claimController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
var router = express.Router();
/* GET users listing. */

router.post(
  "/updateProfile",
  authController.protect,
  userController.updatePassword
);
router.route("/").get(authController.protect, function (req, res, next) {
  const userName = req.session.user.name;
  res.render("profile", { userName: userName });
});

router
  .route("/dashboard")
  .get(authController.protect, async (req, res, next) => {
    const claims = await claimController.getAllClaims(req, res);
    res.render("test", { claims: claims });
  });
//------ steve start ------

//1.2.1
router.route("/claimsByUserId").get(async (req, res, next) => {
  try {
    const claims = await claimController.claimsByUserId(req, res);
    if (claims) {
      let returnJson = req.query.hasOwnProperty("returnJson")
        ? Boolean(Number(req.query.returnJson))
        : false;
      if (returnJson) {
        res.json(claims);
      } else {

        res.render("test", { claims: claims });
      }
    } else {
      res.send("no claims found");
    }
  } finally {
  }
});

//1.3.1
router.route("/claimsByPolicyNumber").get(async (req, res, next) => {
  try {
    //console.log('claimsByPolicyNumber  req.query : ', req.query);// { policyNumber: '9405826' }
    const { policyNumber } = req.query; // { policyNumber: '9405826' }
    console.log("policyNumber : ", policyNumber); //9405826
    const claim = await claimController.claimsByPolicyNumber(req, res);
    console.log("claim : ", claim);

    if (claim) {
      res.json(claim);
    } else {
      res.send("policyNumber : " + req.query.policyNumber + "  not found");
    }
  } finally {
  }
});


//2.0
router.route("/allUsers").get(async (req, res, next) => {
  try {
    const users = await claimController.allUsers(req, res);
    if (users) {
      res.json(users);
    } else {
      res.send("Fail");
    }
  } finally {
  }
});
//2.1.1
router.route("/userByUserId").get(async (req, res, next) => {
  try {
    const user = await claimController.userByUserId(req, res);
    if (user) {
      res.json(user);
    } else {
      res.send("userId : " + req.query.userId + "  not found");
    }
  } finally {
  }
});
//2.1.2
router.route("/userByUserIdUpdateName").get(async (req, res, next) => {
  try {
    const user = await claimController.userByUserIdUpdateName(req, res);
    if (user) {
      res.json(user);
    } else {
      res.send("userId : " + req.query.userId + "  not found");
    }
  } finally {
  }
});
// ------ steve end ------

router
  .route("/forms")
  .get(authController.protect, (req, res, next) => {
    userId = req.session.user.userId;
    userName = req.session.user.name;
    res.render("forms", { userId: userId, name: userName });
  })
  .post(claimController.createClaim);

router
  .route("/signup")
  .get((req, res, next) => {
    if (req.session.user) res.render("forms", {});
    else res.render("register", {});
  })
  .post(authController.signup);

router.route("/logout").post(authController.logout);

module.exports = router;
