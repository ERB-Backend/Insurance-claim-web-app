const mongoose = require("mongoose");
const Claim = require("../models/claimModel");

const User = require("../models/userModel");

const { ObjectId, Db, BSONType } = require("mongodb");
const { Model } = require("mongoose");

const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/claim");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.session.user.userId}-${Date.now()}.${ext}}`);
  },
});

// const multerFilter = (req, file, cb) => {
// if (file.mimetype.startsWith("image")) {
//   cb(null, true);
// } else {
//   cb(null, false);
// }
// };

const upload = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
});

// -------------Start by Michael-----------------
// exports.uploadClaimDocs = upload.single("documents");
exports.uploadClaimDocs = upload.array("documents", 5);

exports.createClaimWithDocs = async (req, res, next) => {
  try {
    if (req.files) {
      // req.body.documents = req.file.path;
      const claimNumber =
        new Date().toISOString().replaceAll("-", "").slice(0, 7) +
        req.body.policyNumber +
        new Date().getMinutes().toString();
      const uploadedFiles = req.files.map((file) => ({ path: file.path }));
      const claimDetail = {
        ...req.body,
        userId: req.session.user._id,
        documents: uploadedFiles,
        claimNumber: claimNumber,
      };
      await Claim.create(claimDetail);
      const successMsg =
        "Claim accepted. Please save Claim number " +
        claimNumber +
        " for future reference";

      req.session.user.message = successMsg;
      res.redirect("/users/forms");
    }
    next();
  } catch (err) {
    if (err.name === "ValidationError") {
      // Handle validation errors
      handleValidationError(err, req);
    } else {
      // Handle other types of errors
      console.error("Error creating claim:", err);
      req.session.user.error = "An unexpected error occurred";
    }
    res.redirect("/users/forms");
  }
};
function handleValidationError(err, req) {
  // Extract error messages
  const errorMessages = Object.values(err.errors).map((error) => error.message);

  // Join all error messages into a single string
  const errorMessage = errorMessages.join(". ");

  // Store the error message in the session
  req.session.user.error = errorMessage;
}

exports.getAllClaims = async (req, res) => {
  try {
    return await Claim.find();
    // res.status(200).json({
    //   status: 'success',
    //   results: claims.length,
    //   data: {
    //     claims,
    //   },
    // });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// exports.createClaim = async (req, res) => {
//   try {
//     const claimDetail = {
//       ...req.body,
//       userId: req.session.user._id,
//       // documents: [{ path: req.body.documents }],
//     };
//     console.log(claimDetail);
//     await Claim.create(claimDetail);
//     res.redirect("/users/dashboard");
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

exports.getUserClaims = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Items per page

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalDocs = await Claim.countDocuments({ userId: userId }).exec();
    const totalPages = Math.ceil(totalDocs / limit);

    console.log("Docs", totalDocs);
    console.log("Pages", totalPages);

    const allClaims = await Claim.find({ userId: userId });
    // Get paginated data
    const claims = await Claim.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();

    // console.log("👋👋👋👋 claims", claims);

    res.render("test", {
      allClaims: allClaims,
      claims: claims,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
    });
  } catch (err) {
    req.session.user.error = err.message;
    res.redirect("users/forms");
  }
};

// End By Michael

// ---------Start by Daniel-----------

exports.sortUserClaims = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const expr = req.body.field;

    if (typeof req.session.sortOrders === "undefined") {
      req.session.sortOrders = {
        policyNumberSort: 1,
        amountSort: 1,
        createdAtSort: 1,
        statusSort: 1,
      };
    }

    req.session.sortOrders[`${expr}Sort`] =
      req.session.sortOrders[`${expr}Sort`] === 1 ? -1 : 1;

    const order = req.session.sortOrders[`${expr}Sort`];

    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Items per page

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalDocs = await Claim.countDocuments({ userId: userId }).exec();
    const totalPages = Math.ceil(totalDocs / limit);

    const allClaims = await Claim.find({ userId: userId });

    // Get paginated data

    const claims = await Claim.find({ userId: userId })
      .sort({ [expr]: order })
      .skip(startIndex)
      .limit(limit)
      .exec();

    // console.log("👋👋👋👋 claims", claims);

    res.render("test", {
      allClaims: allClaims,
      claims: claims,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      sortOrders: req.session.sortOrders,
    });

    // const userId = req.session.user._id;
    // const expr = req.body.field;

    // switch (expr) {
    //   case "policyNumber":
    //     return await Claim.find({ userId: userId }).sort({
    //       policyNumber: -1,
    //     });
    //     break;

    //   case "amount":
    //     return await Claim.find({ userId: userId }).sort({
    //       amount: -1,
    //     });
    //     break;

    //   case "createdAt":
    //     return await Claim.find({ userId: userId }).sort({
    //       createdAt: -1,
    //     });
    //     break;

    //   case "status":
    //     return await Claim.find({ userId: userId }).sort({
    //       status: 1,
    //     });
    //     break;

    //   default:
    //     return await Claim.find({ userId: userId }).sort({
    //       createdAt: -1,
    //       policyName: 1,
    //     });
    //     break;
    // }
    // res.status(200).json({
    //   status: "success",
    //   results: claims.length,
    //   data: {
    //     claims,
    //   },
    // });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//------ steve ------
//1.01
exports.allClaims = async (req, res) => {
  //testQuery();
  //testOnView();

  console.log("req.queryParams : ", req.queryParams);

  try {
    console.log("req.query.sortByCreatedAt : ", req.query.sortByCreatedAt);
    //return (req.query.hasOwnProperty('sortByCompanyName')) ? await Claim.find({}).sort({ companyName: Number(req.query.sortByCompanyName) }) : await Claim.find();
    //return (req.query.hasOwnProperty('sortByPolicyNumber')) ? await Claim.find({}).sort({ policyNumber: Number(req.query.sortByPolicyNumber) }) : await Claim.find();
    //return (req.query.hasOwnProperty('sortByAmount')) ? await Claim.find({}).sort({ amount: Number(req.query.sortByAmount) }) : await Claim.find();
    //return (req.query.hasOwnProperty('sortByStatus')) ? await Claim.find({}).sort({ status: Number(req.query.sortByStatus) }) : await Claim.find();

    let sortOrder = req.query.hasOwnProperty("sortByCreatedAt")
      ? Number(req.query.sortByCreatedAt)
      : -1;
    return await Claim.find({}).sort({ createdAt: sortOrder });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  } finally {
  }
};
exports.claimsByUserId = async (req, res) => {
  try {
    let sortOrder = req.query.hasOwnProperty("sortByCreatedAt")
      ? Number(req.query.sortByCreatedAt)
      : -1;
    const claims = await Claim.find(
      { userId: req.query.userId },
      {
        _id: 1,
        userId: 1,
        companyName: 1,
        policyNumber: 1,
        amount: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).sort({ createdAt: sortOrder });
    console.log("claims.length : ", claims.length);

    if (claims.length > 0) {
      console.log("claims[0] : ", claims[0]);
      const user = await User.findOne({ userId: claims[0].userId });
      console.log(
        "userId : ",
        claims[0].userId,
        "have user.name : ",
        user.name
      );
      const mappedClaims = claims.map((claim) =>
        Object.assign(claim, { userName: user.name })
      );
      console.log("mappedClaims : ", mappedClaims);
      return mappedClaims;
    }
    res.status(404).json({
      status: "no record",
      message: err,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.claimByObjectId = async (req, res) => {
  try {
    const { objectId } = req.query;
    const search_objectId = new mongoose.Types.ObjectId(objectId);
    console.log("typeOf search_objectId : ", typeof search_objectId);
    return await Claim.findOne({ _id: search_objectId });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.claimsByPolicyNumber = async (req, res) => {
  console.log(" req.query.policyNumber : ", req.query.policyNumber);
  console.log(" req.query.sortByPolicyNumber : ", req.query.sortByPolicyNumber);
  // const { policyNumber } = req.query;
  // console.log(' policyNumber : ', policyNumber);
  try {
    return await Claim.find(
      { policyNumber: req.query.policyNumber },
      {
        _id: 1,
        userId: 1,
        policyNumber: 1,
        amount: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).sort({ policyNumber: Number(req.query.sortByPolicyNumber) });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.claimByObjectIdUpdate = async (req, res) => {
  try {
    const { objectId } = req.query;
    const search_objectId = new mongoose.Types.ObjectId(objectId);
    console.log("typeOf search_objectId : ", typeof search_objectId);
    return await Claim.findOneAndReplace(
      { _id: search_objectId },
      {
        companyName: req.query.companyName,
        policyNumber: req.query.policyNumber,
        userId: req.query.userId,
        amount: req.query.amount,
        status: req.query.status,
      },
      { returnOriginal: false }
    ); //{ new: true }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.claimsByPolicyNumberUpdate = async (req, res) => {
  console.log(" req.query : ", req.query); // req.query :  { name: 'steve', 'email:abc@gmail.com': '' }

  //console.log(' policyNumber : ', policyNumber);
  try {
    //const { userId, email } = req.query;//params
    const { userId } = req.query; //params
    console.log("userId : ", userId);
    //console.log('email : ', email);
    //console.log('{} : ', { name: name, email: email });
    console.log("{} : ", { userId: userId });

    // return await Claim.findOneAndReplace({ policyNumber: req.query.policyNumber }, { policyNumber: req.query.newPolicyNumber, userId: 'steve', amount: '9889', status: 'approved' }, { returnOriginal: false });

    return await Claim.findOneAndReplace(
      { policyNumber: req.query.policyNumber },
      {
        companyName: req.query.companyName,
        policyNumber: req.query.newPolicyNumber,
        userId: req.query.userId,
        amount: req.query.amount,
        status: req.query.status,
      },
      { returnOriginal: false }
    ); //{ new: true }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.claimInsert = async (req, res) => {
  console.log(" req.query : ", req.query); // req.query :  { name: 'steve', 'email:abc@gmail.com': '' }

  //console.log(' policyNumber : ', policyNumber);
  try {
    //  await Claim.insertOne({ userId: "steve", policyNumber : "400", amount: 7777, status : 'submitted' });

    // Claim.insertMany([
    //   { userId: 'steve', policyNumber: 401, amount: 123 }
    // ])
    return Claim.insertMany([
      {
        userId: req.query.userId,
        companyName: req.query.companyName,
        policyNumber: req.query.policyNumber,
        amount: req.query.amount,
        status: req.query.status,
      },
    ]);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.claimByObjectIdDelete = async (req, res) => {
  try {
    const { objectId } = req.query;
    const search_objectId = new mongoose.Types.ObjectId(objectId);
    console.log("typeOf search_objectId : ", typeof search_objectId);
    return await Claim.findOneAndDelete(
      { _id: search_objectId },
      { returnOriginal: false }
    ); //{ new: true }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.allUsers = async (req, res) => {
  try {
    console.log("req.query.sortByUserId : ", req.query.sortByUserId);
    let sortOrder = req.query.hasOwnProperty("sortByUserId")
      ? Number(req.query.sortByUserId)
      : 1;
    return await User.find({}).sort({ userId: sortOrder });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  } finally {
  }
};
exports.userByUserId = async (req, res) => {
  console.log(" req.query.userId : ", req.query.userId);
  // const { policyNumber } = req.query;
  // console.log(' policyNumber : ', policyNumber);
  try {
    let user = await User.findOne(
      { userId: req.query.userId },
      {
        _id: 1,
        userId: 1,
        name: 1,
        email: 1,
        photo: 1,
        password: 1,
        passwordConfirm: 1,
      }
    );
    // user.userId = 'davidDoe';
    // await user.save();
    return user;

    // let user = await User.updateOne({ email: req.query.email }, { $set: { name: 'David2' } });
    // if (user.acknowledged) {
    //   console.log('update successful');
    // }
    // else {
    //   console.log('update fail');

    // }
    // return user;

    //return await User.findOne({ userId: req.query.userId }, { _id: 1, userId: 1, name: 1, email: 1 });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.userByUserIdUpdate = async (req, res) => {
  console.log(" req.query.userId : ", req.query.userId);
  // const { policyNumber } = req.query;
  // console.log(' policyNumber : ', policyNumber);
  try {
    //let user = await User.findOne({ email: req.query.email }, { _id: 1, userId: 1, name: 1, email: 1 });
    // user.userId = 'davidDoe';
    // await user.save();
    //return user;

    //let user = await User.updateOne({ email: req.query.email }, { $set: { name: req.query.name } });
    let user = await User.updateOne(
      { userId: req.query.userId },
      { $set: { name: req.query.name } }
    );

    if (user.acknowledged) {
      console.log("update successful");
    } else {
      console.log("update fail");
    }
    return user;

    //return await User.findOne({ userId: req.query.userId }, { _id: 1, userId: 1, name: 1, email: 1 });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
function encodeQueryValue(value) {
  return encodeURIComponent(value);
}
function decodeQueryValue(encodedValue) {
  return decodeURIComponent(encodedValue);
  //return decodeURIComponent(encodedValue.replace(/\+/g, ' ').replace(/%(?![0-9A-F]{2})/i, '%25'));
}
function encodeQueryString(queryObject) {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryObject)) {
    queryParams.append(key, encodeQueryValue(value));
  }
  return queryParams.toString();
}
function decodeQueryObject(encodedQueryString) {
  const queryParams = new URLSearchParams(encodedQueryString);
  const queryObject = {};

  //const queryParams = encodedQueryString.split('&');
  // for (const params of queryParams) {
  //   const [key, value] = params.split('=');
  //   queryObject[decodeQueryValue(key)] = decodeQueryValue(value);
  // }

  for (const [key, value] of queryParams.entries()) {
    queryObject[decodeQueryValue(key)] = decodeQueryValue(value);
    //queryObject[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return queryObject;
}
function queryKeys(queryString) {
  const queryParams = new URLSearchParams(queryString);
  return Array.from(queryParams.keys());
}
function queryDict(queryString) {
  const queryParams = new URLSearchParams(queryString);
  const dict = {};
  for (const [key, value] of queryParams.entries()) {
    dict[key] = value;
  }
  return dict;
}

function testQuery() {
  const queryObject = {
    name: "john lee",
    age: 39,
    city: "旺角",
    hobbies: ["reading", "photography"],
  };
  const encodedQueryString = encodeQueryString(queryObject);
  console.log("encodedQueryString ", encodedQueryString);
  //name=john%2520lee&age=39&city=%25E6%2597%25BA%25E8%25A7%2592&hobbies=reading%252Cphotography

  const decodedQueryObject = decodeQueryObject(encodedQueryString);
  console.log("decodedQueryObject ", decodedQueryObject);
  /* 
  {
    name: 'john lee',
    age: '39',
    city: '旺角',
    hobbies: 'reading,photography'
  }
  */

  const dict = queryDict(encodedQueryString);
  console.log("dict ", dict);
  /*
  dict  {
    name: 'john%20lee',
    age: '39',
    city: '%E6%97%BA%E8%A7%92',
    hobbies: 'reading%2Cphotography'
  }
  */
  console.log("queryKeys ", queryKeys(encodedQueryString));
  //[ 'name', 'age', 'city', 'hobbies' ]

  let brand = "VW";
  let model;
  let yearMade = "2020";
  console.log("model ", model);

  if (typeof model == "undefined") {
    console.log("1 model is undefined");
  }
  if (model == undefined) {
    console.log("2 model is undefined");
  }

  if (decodedQueryObject.hasOwnProperty("name")) {
    console.log("decodedQueryObject hasOwnProperty name is YES");
  } else {
    console.log("decodedQueryObject hasOwnProperty name is NO");
  }

  if (decodedQueryObject.hasOwnProperty("account")) {
    console.log("decodedQueryObject hasOwnProperty account is YES");
  } else {
    console.log("decodedQueryObject hasOwnProperty account is NO");
  }
  /*
decodedQueryObject hasOwnProperty name is YES
decodedQueryObject hasOwnProperty account is NO
  */
  if (!("account" in decodedQueryObject)) {
    console.log("account is undefined");
  } else {
    console.log("account is defined");
  }
}
function testOnView() {
  // const { MongoClient } = require('mongodb');
  // const client = new MongoClient('mongodb://localhost:27017');
  // const db = client.db('your_database_name');

  console.log("DB : ", DB);
  DB.createView(
    "user_claims",
    [
      {
        $lookup: {
          from: "claims",
          localField: "_id",
          foreighField: "userId",
          as: "claims",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ],
    {
      validator: {
        $joinSchema: {
          BSONType: "objects",
          required: ["name"],
          properties: {
            BSONType: "string",
            description: "must be a string and is required",
          }, //END properties
        }, //END joinSchema
      }, //END validator
    } //END
  ); //END createView

  db.user_claims.find({ userId: steve });
}
