const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  policyNumber: {
    type: Number,
    required: [true, "You must include the policy number"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "You must include the claim amount"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["submitted", "approved", "declined", "closed", "pending"],
    default: "submitted",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
