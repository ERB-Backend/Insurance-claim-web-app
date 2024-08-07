var express = require("express");
const Claim = require("../models/claimModel");
const claimController = require("../controllers/claimController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({
  dest: "upload/claim",
  limits: { fileSize: 1024 * 1024 },
});
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
var router = express.Router();
/* GET users listing. */

// -------------------Michael Start----------------------

router
  .route("/claim")
  .post(
    claimController.uploadClaimDocs,
    claimController.createClaimWithDocs,
    async (req, res, next) => {
      console.log(req.files);
      console.log(req.body);
    }
  );

router.post(
  "/updateProfile",
  authController.protect,
  userController.updateProfile
);

router.route("/").get(authController.protect, async function (req, res, next) {
  try {
    const userName = req.session.user.name;
    const messages = await getClaimsWithMessages(req.session.user._id);
    let error = null;
    let message = null;
    if (req.session.user && req.session.user.error) {
      error = req.session.user.error;
      delete req.session.user.error;
    }
    if (req.session.user && req.session.user.message) {
      message = req.session.user.message;
      delete req.session.user.message;
    }

    console.log("Number of messages to render:", messages.length);

    res.render("profile", {
      userName: userName,
      messages,
      error: error,
      message: message,
    });
  } catch (err) {
    console.error("Error in route handler:", err);
    next(err);
  }
});

async function getClaimsWithMessages(userId) {
  try {
    const messages = await Claim.aggregate([
      // Match claims for the current user
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      // Unwind the messages array to create a document for each message
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: false } },

      // Sort by message date (newest first)
      { $sort: { "messages.date": -1 } },

      // Project the required fields for each message
      {
        $project: {
          policyNumber: 1,
          claimNumber: 1,
          status: "$messages.status",
          date: "$messages.date",
          messageText: {
            $concat: [
              "#",
              { $toString: "$policyNumber" },
              " was ",
              "$messages.status",
              " on ",
              { $dateToString: { format: "%d %b %Y", date: "$messages.date" } },
              " [Ref No. ",
              { $toString: "$claimNumber" },
              "]",
            ],
          },
        },
      },
    ]).exec();

    console.log("Number of individual messages:", messages.length);
    console.log("All messages:", JSON.stringify(messages, null, 2));

    return messages;
  } catch (error) {
    console.error("Error fetching claims and messages:", error);
    throw error;
  }
}

router
  .route("/dashboard")
  .get(authController.protect, claimController.getUserClaims);
// .post(authController.protect, claimController.sortUserClaims);

router.route("/forms").get(authController.protect, (req, res, next) => {
  userId = req.session.user.userId;
  userName = req.session.user.name;
  let error = null;
  let message = null;
  if (req.session.user && req.session.user.error) {
    error = req.session.user.error;
    delete req.session.user.error;
  }
  if (req.session.user && req.session.user.message) {
    message = req.session.user.message;
    delete req.session.user.message;
  }
  res.render("forms", {
    userId: userId,
    name: userName,
    error: error,
    message: message,
  });
  // res.sendFile(path.join(__dirname, "../views", "/claim.html"));
});
// .post(claimController.createClaim);
// .post(
// claimController.uploadClaimDocs
// claimController.createClaimWithDocs
// );

router
  .route("/signup")
  .get((req, res, next) => {
    if (req.session.user) res.render("forms", {});
    else res.render("register", { error: null });
  })
  .post(authController.signup);

router.route("/logout").post(authController.logout);
router.route("/deleteAccount").post(userController.deleteCustomer);

router.route("/render-claims").post((req, res) => {
  console.log("Received request to render claims");
  try {
    const claims = req.body.claims;
    console.log("Claims received:", JSON.stringify(claims, null, 2));

    if (!claims || !Array.isArray(claims)) {
      throw new Error("Invalid claims data received");
    }

    res.render("partials/claim-result", { claims }, (err, html) => {
      if (err) {
        console.error("Error rendering claims:", err);
        res.status(500).json({
          error: "Error rendering claims",
          details: err.message,
          stack: err.stack,
        });
      } else {
        console.log("Claims rendered successfully");
        res.send(html);
      }
    });
  } catch (error) {
    console.error("Error in /render-claims:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
      stack: error.stack,
    });
  }
});

router.get("/claims", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const claims = await Claim.find({ userId: req.session.user._id })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalClaims = await Claim.countDocuments({
      userId: req.session.user._id,
    });
    const totalPages = Math.ceil(totalClaims / limit);

    res.json({
      claims,
      currentPage: page,
      totalPages,
      totalClaims,
    });
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ error: "An error occurred while fetching claims" });
  }
});

//   Michael end

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

// ---------Betty Start----------------------

// router.post("/claim", upload.single("claim_doc"), async (req, res, next) => {
//   try {
//     let pNumber = req.body.policyNumber;
//     let amt = req.body.amt;
//     let iDate = req.body.dateIncurred;
//     let statusDate; // 1: OK    2: not OK
//     let statusFile; // 1: OK    2: not OK
//     const errDate =
//       "The claim period of 3 months has passed; therefore your claim cannot be accepted.";
//     const successMsg = "Your claim has been accepted.";
//     const successFiles = "Number of files received: req.files.length.";
//     // Format the current date to yyyymmdd string and time (minutes) to string
//     let cDate = new Date();
//     let cTime = cDate.getMinutes().toString();
//     let sDate = cDate.toISOString().replaceAll("-", "").slice(0, 7);
//     // Check if the expense incurred date is past the 90-day claim period.
//     let vDate = new Date(iDate); // iDate is from the form req.body.dateIncurred
//     vDate.setDate(vDate.getDate() + 90); // expiry is 90 days from the incurred date
//     statusDate = cDate <= vDate ? 1 : 2;
//     // Generate a unique claim reference number - input date (yyyymmdd) + policy number + time of day.
//     let cNumber = sDate + pNumber + cTime;
//     // Upload files, up to 5.
//     if (!fs.existsSync("public/upload/claim/" + cNumber))
//       fs.mkdirSync("public/upload/claim/" + cNumber, { recursive: true });
//     for (let f of req.files)
//       fs.renameSync(f.path, "public/upload/claim/" + cNumber + f.originalname);
//     // res.send(req.files.length + " files uploaded")
//     statusFile = req.files.length > 0 ? 1 : 2; // any supporting documents uploaded?
//     // Proceed to create the claim entry in the database "icwa", collection "claims".
//     let arrayPaths = [];
//     for (let i = 0; i > req.files.length; i++) {
//       arrayPaths = req.files.push(i);
//     }
//     await Claim.insertOne({
//       policyNumber: pNumber,
//       amount: amt,
//       dateIncurred: iDate,
//       dateSubmitted: cDate,
//       claimNumber: cNumber,
//     });
//     await claimsDoc.insertOne({
//       claimNumber: cNumber,
//       filePath: arrayPaths,
//     });
//     //    res.render(ackPage);                          // to be developed
//     res.send("Claim accepted.", cNumber, "Please save it for future reference");
//     // catch 404 and forward to error handler
//     // app.use(function(req, res, next) {
//     //     next(createError(404));
//     //  });
//   } finally {
//     await client.close();
//   }
// });

module.exports = router;
