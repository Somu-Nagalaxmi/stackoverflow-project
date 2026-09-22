import mongoose from "mongoose";

const notificationschema = mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
    },

    sender: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["like", "comment", "follow", "mention"],
      required: true,
    },

    postId: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("notification", notificationschema);