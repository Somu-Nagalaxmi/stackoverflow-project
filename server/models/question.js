 import mongoose from "mongoose";

const questionschema = mongoose.Schema(
  {
    questiontitle: {
      type: String,
      required: true,
    },

    questionbody: {
      type: String,
      required: true,
    },

    questiontags: {
      type: [String],
      required: true,
    },

    noofanswer: {
      type: Number,
      default: 0,
    },

    upvote: {
      type: [String],
      default: [],
    },

    downvote: {
      type: [String],
      default: [],
    },

    userposted: {
      type: String,
    },

    userid: {
      type: String,
    },

    askedon: {
      type: Date,
      default: Date.now,
    },

    // =========================
    // REPUTATION SYSTEM
    // =========================

    // +2 reputation when question
    // receives 10 upvotes.
    // This prevents duplicate reward.
    questionRewardAwarded: {
      type: Boolean,
      default: false,
    },

    answer: [
      {
        answerbody: {
          type: String,
        },

        useranswered: {
          type: String,
        },

        userid: {
          type: String,
        },

        answeredon: {
          type: Date,
          default: Date.now,
        },

        // =========================
        // ANSWER REPUTATION
        // =========================

        // +10 when accepted answer
        accepted: {
          type: Boolean,
          default: false,
        },

        // +5 when answer gets 5 upvotes
        answerRewardAwarded: {
          type: Boolean,
          default: false,
        },

        answerUpvotes: {
          type: [String],
          default: [],
        },

        answerDownvotes: {
          type: [String],
          default: [],
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("question", questionschema);