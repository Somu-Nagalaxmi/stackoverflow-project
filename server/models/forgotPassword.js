import mongoose from "mongoose";

const forgotPasswordSchema = mongoose.Schema(
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

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "forgotPassword",
  forgotPasswordSchema
);