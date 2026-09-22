 import mongoose from "mongoose";

const loginHistorySchema = mongoose.Schema(
  {
    userid: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    loginTime: {
      type: Date,
      default: Date.now,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("loginHistory", loginHistorySchema);