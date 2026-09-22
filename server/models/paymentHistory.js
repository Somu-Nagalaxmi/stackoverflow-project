import mongoose from "mongoose";

const paymentHistorySchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    plan: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySubscriptionId: {
      type: String,
      default: "",
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "failed", "refunded"],
      default: "paid",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("paymentHistory", paymentHistorySchema);