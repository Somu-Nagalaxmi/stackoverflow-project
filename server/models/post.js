import mongoose from "mongoose";

const postschema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      default: "",
    },

    hashtags: {
      type: [String],
      default: [],
    },

    userposted: {
      type: String,
      required: true,
    },

    userid: {
      type: String,
      required: true,
    },

    likes: {
      type: [String],
      default: [],
    },

    bookmarks: {
      type: [String],
      default: [],
    },

    comments: [
      {
        commentbody: {
          type: String,
          required: true,
        },

        usercommented: {
          type: String,
          required: true,
        },

        userid: {
          type: String,
          required: true,
        },

        commentedon: {
          type: Date,
          default: Date.now,
        },

        replies: [
          {
            replybody: String,
            userreplied: String,
            userid: String,
            repliedon: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],

    shares: {
      type: Number,
      default: 0,
    },

    reportedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("post", postschema);