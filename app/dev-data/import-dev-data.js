const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Claim = require("../models/claimModel");

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

const importData = async () => {
  try {
    await Claim.create(claims);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Claim.deleteMany();
    console.log("Data successfully deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
