import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    loginTime: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("session", sessionSchema);