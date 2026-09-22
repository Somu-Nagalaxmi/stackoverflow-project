 import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: "",
  },

  password: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    default: "",
  },

  tags: {
    type: [String],
    default: [],
  },

  language: {
    type: String,
    enum: ["en", "es", "hi", "pt", "zh", "fr"],
    default: "en",
  },

  following: {
    type: [String],
    default: [],
  },

  followers: {
    type: [String],
    default: [],
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  suspended: {
    type: Boolean,
    default: false,
  },

  // =========================
  // REPUTATION SYSTEM
  // =========================

  reputation: {
    type: Number,
    default: 0,
  },

  // Profile completion reward
  // +10 only once
  profileBonusAwarded: {
    type: Boolean,
    default: false,
  },
  subscriptionPlan: {
  type: String,
  enum: ["Free", "Bronze", "Silver", "Gold"],
  default: "Free",
},

subscriptionStatus: {
  type: String,
  enum: ["inactive", "active", "cancelled", "expired"],
  default: "inactive",
},

razorpaySubscriptionId: {
  type: String,
  default: "",
},

subscriptionStartDate: {
  type: Date,
  default: null,
},

subscriptionEndDate: {
  type: Date,
  default: null,
},

renewalDate: {
  type: Date,
  default: null,
},

billingName: {
  type: String,
  default: "",
},

billingEmail: {
  type: String,
  default: "",
},

billingPhone: {
  type: String,
  default: "",
},
  joinDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", userschema);
