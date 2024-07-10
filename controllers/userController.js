const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const userId = req.session.user._id;
  console.log(userId);
  const { name, currentPassword, password, passwordConfirm } = req.body;
  const user = await Users.findById(userId).select("+password");
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return res.status(400).json({ message: "Your current password is wrong" });
  }
  user.name = name;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  req.session.user = user;
  res.redirect("/users");
});

exports.getAllUsers = async (req, res) => {
  try {
    return await Users.find();
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

exports.getOneUser = async (req, res) => {
  try {
    let data = await Users.findById({ userId: req.body.userId });
    // console.log(data);
    if (data) {
      // data.userName = req.body.name;
      // data.password = req.body.password;
      // data.passwordConfirm = req.body.passwordConfirm;
      // console.log(data);

      const result = await Users.updateOne(
        { userId: req.body.userId },
        // {$set:{ userId:req.body.userId, name: data.userName, password: data.password, passwordConfirm: data.passwordConfirm, }}, { runValidators: true });
        {
          $set: {
            userId: req.body.userId,
            name: "154465",
            password: "password789",
            passwordConfirm: "password789",
          },
        },
        {
          new: true,
          runValidators: true,
          context: "query", // This is important for running the validation
        }
      );

      // {$set:{ name: data.userName, password: data.password, passwordConfirm: data.passwordConfirm, }}, opts);
      // res.send(`Updated ${result.matchedCount} records`);
      // return result;
      // res.redirect('/users');

      // res.status(200).json({
      //   status: 'success',
      //   results: claims.length,
      //   data: {
      //     claims,
      //   },
      // });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      Object.keys(err.errors).forEach((field) => {
        console.error(
          `Validation errorin field "${field}":`,
          err.errors[field].message
        );
      });
    } else {
      console.error("An unexpected error occurered:", err);
    }
  }
};

exports.submitProfileForm = (req, res) => {
  const { firstname, lastname, userId, email, password, passwordConfirm } =
    req.body;

  const newProfile = new Profile({
    firstname,
    lastname,
    userId,
    email,
    password,
    passwordConfirm,
  });

  newProfile
    .save()
    .then((profile) => {
      res.status(201).json(profile);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
};

// exports.matchOne = async (req, res) => {
//   try {
//     return await Users.findOne({}, {userId:"john"});

//     // await Claim.create(req.body);
//     // res.redirect("/users/dashboard");
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

//   // Controller method for fetching all contact submissions
//   exports.getAllContactSubmissions = (req, res) => {
//     Contact.find({})
//       .then(submissions => {
//         res.json(submissions);
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).send('An error occurred');
//       });
//   };
