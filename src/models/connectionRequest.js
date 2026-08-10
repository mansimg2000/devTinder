const mongoose = require("mongoose");

const STATUS_TYPES = ["interested", "ignored", "accepted", "rejected"];

const connectRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      enum: {
        values: STATUS_TYPES,
        message: "{VALUE} status type is not allowed!",
      },
      required: true
    },
  },
  { timestamps: true },
);

connectRequestSchema.index({ totoUserId: 1, fromUserId: 1 });

connectRequestSchema.pre("save", function () {
  let toUserId = this.toUserId;
  let fromUserId = this.fromUserId;
  if (toUserId.equals(fromUserId)) {
    throw new Error("You can not sent a request to yourself!");
  }
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectRequestSchema,
);

module.exports = ConnectionRequestModel;
