import mongoose from "mongoose";

const reputationHistorySchema = mongoose.Schema(
  {
    userid: {
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

    type: {
      type: String,
      enum: ["earned", "lost", "transfer_sent", "transfer_received"],
      required: true,
    },

    relatedUserId: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model(
  "reputationHistory",
  reputationHistorySchema
);