import mongoose from "mongoose";

const languageVerificationSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      enum: ["en", "es", "hi", "pt", "zh", "fr"],
      required: true,
    },

    verificationMethod: {
      type: String,
      enum: ["email", "phone"],
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
  },
  { timestamps: true }
);

export default mongoose.model(
  "languageVerification",
  languageVerificationSchema
);