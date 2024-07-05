var express = require("express");
const claimController = require("../controllers/claimController");
var router = express.Router();
const Claim = require("../models/claimModel");
/* GET users listing. */



//NEW
// const { ObjectId } = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;












router.route("/").get(function (req, res, next) {
  res.render("profile", {});
});


router.route("/dashboard").get(async (req, res, next) => {
  const claims = await claimController.getAllClaims(req, res);
  console.log('clams : ', claims);
  res.render("test", { claims: claims });
});


//------ steve start ------
router.route("/allClaims").get(async (req, res, next) => {
  try {
    const claims = await claimController.allClaims(req, res);
    if (claims) {
      let returnJson = (req.query.hasOwnProperty('returnJson')) ? Boolean(Number(req.query.returnJson)) : false;
      if (returnJson) {
        res.json(claims);
      } else {
        res.render("test", { claims: claims });
      }
    }
    else {
      res.send('Fail');
    }
  } finally {

  }
});
router.route("/sort").get(async (req, res, next) => {
  try {
    const claims = await claimController.allClaims(req, res);
    if (claims) {
      // let returnJson = (req.query.hasOwnProperty('returnJson')) ? Boolean(Number(req.query.returnJson)) : false;
      // if (returnJson) {
      //   res.json(claims);
      // } else {
      //   res.render("test", { claims: claims });
      // }
    }
    else {
      res.send('Fail');
    }
  } finally {

  }
});
router.route("/claimsByUserId").get(async (req, res, next) => {
  try {
    const claims = await claimController.claimsByUserId(req, res);
    if (claims) {
      let returnJson = (req.query.hasOwnProperty('returnJson')) ? Boolean(Number(req.query.returnJson)) : false;
      if (returnJson) {
        res.json(claims);
      } else {
        //res.json(claims);//temp
        res.render("test", { claims: claims });
      }
    }
    else {
      res.send('not claims found by userId : ' + req.query.userId);
    }
  } finally {

  }
});

router.route("/claimByObjectId").get(async (req, res, next) => {
  try {
    console.log('claimByObjectId  req.query : ', req.query);
    const { objectId } = req.query;
    console.log('objectId : ', objectId);
    const claim = await claimController.claimByObjectId(req, res);
    console.log('claim : ', claim);
    if (claim) {
      res.json(claim);
    }
    else {
      res.send('objectId : ' + req.query.objectId + '  not found');
    }
  } finally {

  }
});

router.route("/claimsByPolicyNumber").get(async (req, res, next) => {
  try {
    //console.log('claimsByPolicyNumber  req.query : ', req.query);// { policyNumber: '9405826' }
    const { policyNumber } = req.query;// { policyNumber: '9405826' }
    console.log('policyNumber : ', policyNumber);//9405826
    const claim = await claimController.claimsByPolicyNumber(req, res);
    console.log('claim : ', claim);

    if (claim) {
      //console.log('_id : ', claim._id);
      //res.send('policyNumber : ' + req.query.policyNumber + ' found');
      res.json(claim);
    }
    else {
      res.send('policyNumber : ' + req.query.policyNumber + '  not found');
    }
  } finally {

  }
});
router.route("/claimByObjectIdUpdate").get(async (req, res, next) => {
  try {
    const claim = await claimController.claimByObjectIdUpdate(req, res);
    console.log('claim : ', claim);

    if (claim) {
      //console.log('_id : ', claim._id);
      //res.send('policyNumber : ' + req.query.policyNumber + ' found');
      res.json(claim);
    }
    else {
      res.send('objectId : ' + req.query.objectId + '  not found');
    }
  } finally {

  }
});
router.route("/claimsByPolicyNumberUpdate").get(async (req, res, next) => {
  try {
    const claim = await claimController.claimsByPolicyNumberUpdate(req, res);
    console.log('claim : ', claim);

    if (claim) {
      //console.log('_id : ', claim._id);
      //res.send('policyNumber : ' + req.query.policyNumber + ' found');

      res.json(claim);
    }
    else {
      res.send('policyNumber : ' + req.query.policyNumber + '  not found');
    }
  } finally {

  }
});
router.route("/claimInsert").get(async (req, res, next) => {
  try {
    const claim = await claimController.claimInsert(req, res);
    console.log('claim : ', claim);

    if (claim) {
      //console.log('_id : ', claim._id);
      //res.send('policyNumber : ' + req.query.policyNumber + ' found');
      res.json(claim);
    }
    else {
      res.send('insert fail');
    }
  } finally {

  }
});
router.route("/claimByObjectIdDelete").get(async (req, res, next) => {
  try {
    const claim = await claimController.claimByObjectIdDelete(req, res);
    console.log('claim : ', claim);

    if (claim) {
      //console.log('_id : ', claim._id);
      //res.send('policyNumber : ' + req.query.policyNumber + ' found');
      res.json(claim);
    }
    else {
      res.send('objectId : ' + req.query.objectId + '  not found');
    }
  } finally {

  }
});
router.route("/allUsers").get(async (req, res, next) => {
  try {
    const users = await claimController.allUsers(req, res);
    if (users) {
      let returnJson = (req.query.hasOwnProperty('returnJson')) ? Boolean(Number(req.query.returnJson)) : false;
      if (returnJson) {
        res.json(users);
      } else {
        res.json(users);//TEMP
        //res.render("test", { users: users });
      }
    }
    else {
      res.send('Fail');
    }
  } finally {

  }
});
router.route("/userByUserId").get(async (req, res, next) => {
  try {
    const user = await claimController.userByUserId(req, res);
    if (user) {
      let returnJson = (req.query.hasOwnProperty('returnJson')) ? Boolean(Number(req.query.returnJson)) : false;
      if (returnJson) {
        res.json(user);
      } else {
        res.json(user);//TEMP
        //res.render("test", { user: user });
      }
    }
    else {
      res.send('userId : ' + req.query.userId + '  not found');
    }
  } finally {

  }
});
router.route("/userByUserIdUpdate").get(async (req, res, next) => {
  try {
    const user = await claimController.userByUserIdUpdate(req, res);
    if (user) {
      let returnJson = (req.query.hasOwnProperty('returnJson')) ? Boolean(Number(req.query.returnJson)) : false;
      if (returnJson) {
        res.json(user);
      } else {
        res.json(user);//TEMP
        //res.render("test", { user: user });
      }
    }
    else {
      res.send('userId : ' + req.query.userId + '  not found');
    }
  } finally {

  }
});
// ------ steve end ------


router
  .route("/forms")
  .get(function (req, res, next) {
    res.render("forms", {});
  })
  .post(claimController.createClaim);
module.exports = router;
