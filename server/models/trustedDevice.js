import mongoose from "mongoose";

const trustedDeviceSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    deviceName: {
      type: String,
      default: "Unknown Device",
    },

    userAgent: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    trustedAt: {
      type: Date,
      default: Date.now,
    },

    isTrusted: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("trustedDevice", trustedDeviceSchema);