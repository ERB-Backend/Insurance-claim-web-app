const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Start by Michael
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const userId = req.session.user._id;
  console.log(userId);
  const { name, currentPassword, password, passwordConfirm } = req.body;

  // Find the user
  const user = await Users.findById(userId).select("+password");

  if (!user) {
    req.session.user.error = "User not found";
    return res.redirect("/");
  }

  // Check if password fields are provided
  const isChangingPassword = password && passwordConfirm;

  // If changing password, verify current password
  if (isChangingPassword) {
    if (!currentPassword) {
      req.session.user.error =
        "Current password is required to change password";
      return res.redirect("/users");
    }

    if (!(await user.correctPassword(currentPassword, user.password))) {
      req.session.user.error = "Your current password is wrong";
      return res.redirect("/users");
    }

    // Update password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
  }

  // Update name if provided
  if (name && name !== user.name) {
    user.name = name;
  }

  // Only save if there are changes
  if (isChangingPassword || (name && name !== user.name)) {
    await user.save();
    req.session.user = user;
    req.session.user.message = "Profile updated successfully";
  } else {
    req.session.user.error = "No changes were made";
  }

  console.log("🔥🔥🔥🔥🔥🔥", req.session.user);

  res.redirect("/users");
});

exports.deleteCustomer = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    await Users.deleteOne({ userId: userId });
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

// End by Michael

// Start by Daniel
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

// End by Daniel
