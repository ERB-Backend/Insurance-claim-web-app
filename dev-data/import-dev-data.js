const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Claim = require("../models/claimModel");
const User = require("../models/userModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {}).then(() => console.log("DB connection successful"));
// console.log(process.env);

const claims = JSON.parse(
  fs.readFileSync(`${__dirname}/claim-sample.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/user-sample.json`, "utf-8")
);

const importClaim = async () => {
  try {
    await Claim.create(claims);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteClaim = async () => {
  try {
    await Claim.deleteMany();
    console.log("Data successfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const importUser = async () => {
  try {
    await User.create(users);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async () => {
  try {
    await User.deleteMany();
    console.log("Data successfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--importClaim") {
  importClaim();
} else if (process.argv[2] === "--deleteClaim") {
  deleteClaim();
} else if (process.argv[2] === "--importUser") {
  importUser();
} else if (process.argv[2] === "--deleteUser") {
  deleteUser();
}

console.log(process.argv);
