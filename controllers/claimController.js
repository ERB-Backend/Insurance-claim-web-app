const mongoose = require("mongoose");
const Claim = require("../models/claimModel");

const User = require("../models/userModel");

const { ObjectId, Db, BSONType } = require("mongodb");
const { Model } = require("mongoose");

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
exports.createClaim = async (req, res) => {
  try {
    await Claim.create(req.body);
    res.redirect("/users/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//------ steve ------
//1.0
exports.allClaims = async (req, res) => {
  //testQuery();
  //testOnView();
  //console.log("req.queryParams : ", req.queryParams);
  try {
    const sortOrder = {};
    if (req.query.hasOwnProperty("sortByCreatedAt")) {
      sortOrder.createdAt = Number(req.query.sortByCreatedAt);
    }
    if (req.query.hasOwnProperty("sortByPolicyNumber")) {
      sortOrder.policyNumber = Number(req.query.sortByPolicyNumber);
    }
    if (req.query.hasOwnProperty("sortByAmount")) {
      sortOrder.amount = Number(req.query.sortByAmount);
    }
    if (req.query.hasOwnProperty("sortByStatus")) {
      sortOrder.status = Number(req.query.sortByStatus);
    }

    const claims = await Claim.find({}).sort(sortOrder);
    const users = await User.find({});
    console.log('users[0].name :', users[0].name);
    //users.forEach(x => console.log(x.name));
    console.log('****** user _id ******');
    users.forEach(x => console.log(x._id, typeof (x._id)));
    const mappedClaims = claims.map((claim) => {
      //console.log('claim.userId : ', claim.userId);
      const user = users.filter(x => x._id.equals(claim.userId));
      console.log('user : ', user);
      // console.log('user.name : ', user[0].name);
      const n = (user.length > 0) ? user[0].name : 'undefined';
      return Object.assign(claim, { userName: n });
    }
    );
    return mappedClaims;//claims;
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  } finally {
  }
};
//1.1.1
exports.claimByObjectId = async (req, res) => {
  try {
    const { objectId } = req.query.objectId;//668f60a271be094fd33af9f3
    const search_objectId = new mongoose.Types.ObjectId(req.query.objectId);
    console.log("typeOf search_objectId : ", typeof search_objectId);
    return await Claim.findOne({ _id: search_objectId });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
//1.1.2
exports.claimByObjectIdUpdateStatus = async (req, res) => {
  try {
    const { objectId } = req.query;
    const search_objectId = new mongoose.Types.ObjectId(req.query.objectId);
    console.log("typeOf search_objectId : ", typeof search_objectId);
    return await Claim.updateOne(
      { _id: search_objectId },
      { status: req.query.status },
      { $set: { isActive: true } }
    );
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
//1.2.1
exports.claimsByUserId = async (req, res) => {
  try {
    const sortOrder = {};
    if (req.query.hasOwnProperty("sortByCreatedAt")) {
      sortOrder.createdAt = Number(req.query.sortByCreatedAt);
    }
    if (req.query.hasOwnProperty("sortByPolicyNumber")) {
      sortOrder.policyNumber = Number(req.query.sortByPolicyNumber);
    }
    if (req.query.hasOwnProperty("sortByAmount")) {
      sortOrder.amount = Number(req.query.sortByAmount);
    }
    if (req.query.hasOwnProperty("sortByStatus")) {
      sortOrder.status = Number(req.query.sortByStatus);
    }
    //console.log('req.session.user.userId : ', req.session.user.userId);//steve
    //console.log('req.session.user._id : ', req.session.user._id);//6688058db58ce72799586539
    //console.log('typeOf req.session.user._id : ', typeof (req.session.user._id));//string
    const userObjectId = new ObjectId(req.session.user._id);
    //console.log('typeOf userObjectId : ', typeof (userObjectId));//object
    const claims = await Claim.find({ "userId": userObjectId }, {
      _id: 1,
      userId: 1,
      policyNumber: 1,
      amount: 1,
      status: 1,
      messages: 1,
      createdAt: 1,
      updatedAt: 1,
    }).sort(sortOrder);

    console.log("claims.length : ", claims.length);
    if (claims.length > 0) {
      //console.log("claims[0] : ", claims[0]);
      const user = await User.findOne({ _id: userObjectId });

      console.log(
        "userId : ",
        userObjectId,
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
//1.3.1
exports.claimsByPolicyNumber = async (req, res) => {
  console.log(" req.query.policyNumber : ", req.query.policyNumber);
  console.log(" req.query.sortByPolicyNumber : ", req.query.sortByPolicyNumber);
  // const { policyNumber } = req.query;
  // console.log(' policyNumber : ', policyNumber);
  try {
    const sortOrder = {};
    if (req.query.hasOwnProperty("sortByCreatedAt")) {
      sortOrder.createdAt = Number(req.query.sortByCreatedAt);
    }
    return await Claim.find(
      { policyNumber: req.query.policyNumber },
      {
        _id: 1,
        userId: 1,
        policyNumber: 1,
        amount: 1,
        status: 1,
        messages: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).sort(sortOrder);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};




//2.0
exports.allUsers = async (req, res) => {
  try {
    //console.log("req.query.sortByUserId : ", req.query.sortByUserId);
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
//2.1.1
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
//2.1.2
exports.userByUserIdUpdateName = async (req, res) => {
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
//--------- Methods -----------------
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
function testConnect() {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient('mongodb://localhost:27017');
  const db = client.db('test');



}
function testRemoteConnect() {
  const { MongoClient } = require('mongodb');
  const uri = "mongodb+srv://demo:btWOND4S2uLxMNjB@cluster0.bd9bzhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true";
  const client = new MongoClient(uri);
  const db = client.db('test').collection('users');




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
};

