import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    plan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    razorpayPlanId: {
      type: String,
      default: "",
    },

    razorpaySubscriptionId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "created",
        "active",
        "cancelled",
        "expired",
        "halted",
        "pending",
      ],
      default: "created",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    renewalDate: {
      type: Date,
      default: null,
    },

    cancelAtCycleEnd: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("subscription", subscriptionSchema);