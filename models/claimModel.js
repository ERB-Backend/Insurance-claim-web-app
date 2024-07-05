const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [false, "You must include the userId"],
    trim: true,
  },
  userName: {
    type: String,
    required: [false, "Use this in runtime only"],
    trim: false,
  },
  companyName: {
    type: String,
    required: [false, "companyName is optional"],
    trim: false,
  },
  policyNumber: {
    type: Number,
    required: [true, "You must include the policy number"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "You must include the claim amount"],
    //unique : false,
    //trim: true,
  },
  status: {
    type: String,
    //enum: ["new","submitted", "approved", "declined", "closed", "pending"],
    enum: ["pending","processing", "approved", "declined"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
