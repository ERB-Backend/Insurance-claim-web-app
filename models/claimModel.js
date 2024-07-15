const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "processing", "approved", "declined"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    path: {
      type: String,
    },
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    claimNumber: {
      type: Number,
    },
    userName: {
      type: String,
      required: [false, "Use this in runtime only"],
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
    messages: [messageSchema],
    incurredDate: {
      type: Date,
      required: [false, "Incurred date is required"],
      validate: {
        validator: function (value) {
          const today = new Date();
          const ninetyDaysAgo = new Date(
            today.getTime() - 90 * 24 * 60 * 60 * 1000
          );
          return value >= ninetyDaysAgo && value <= today;
        },
        message: (props) =>
          `Incurred date must be within the last 90 days. Given date: ${props.value}`,
      },
    },
    documents: [documentSchema],
  },
  { timestamps: true }
);

claimSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("status")) {
    this.messages.push({ status: this.status });
  }
  next();
});

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
