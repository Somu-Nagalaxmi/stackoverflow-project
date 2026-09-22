import mongoose from "mongoose";

const reportschema = mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },

    reportedBy: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("report", reportschema);