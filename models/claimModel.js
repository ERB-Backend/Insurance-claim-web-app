const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
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
      // trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
