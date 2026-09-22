import mongoose from "mongoose";

const reputationTransferSchema = mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },

    receiver: {
      type: String,
      required: true,
    },

    points: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "reputationTransfer",
  reputationTransferSchema
);