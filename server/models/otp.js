 import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    purpose: {
      type: String,
      enum: ["general", "login"],
      default: "general",
    },
  },
  { timestamps: true }
);

export default mongoose.model("otp", otpSchema);