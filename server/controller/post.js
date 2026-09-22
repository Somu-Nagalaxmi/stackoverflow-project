
import mongoose from "mongoose";
import post from "../models/post.js";
import user from "../models/auth.js";
import notification from "../models/notification.js";
// Create a new post
 export const createpost = async (req, res) => {
  const { postdata } = req.body;

  try {
    const currentUser = await user.findById(req.userid);

    if (!currentUser) {
     return res.status(404).json({
        message: "User not found",
     });
    }

    if (currentUser.suspended) {
    return res.status(403).json({
       message: "Your account has been suspended",
     });
    }
    const newpost = new post({
      ...postdata,
      userid: req.userid,
    });

    await newpost.save();

    // Find mentions like @Bindu
    const mentionMatches = postdata.content?.match(/@([a-zA-Z0-9_]+)/g) || [];

    for (const mention of mentionMatches) {
      const mentionedName = mention.substring(1);

      const mentionedUser = await user.findOne({
        name: { $regex: `^${mentionedName}$`, $options: "i" },
      });

      // Don't notify if user mentions themselves
      if (
        mentionedUser &&
        String(mentionedUser._id) !== String(req.userid)
      ) {
        await notification.create({
          recipient: String(mentionedUser._id),
          sender: String(req.userid),
          type: "mention",
          postId: String(newpost._id),
          message: `You were mentioned in a post`,
        });
      }
    }

    res.status(200).json({
      data: newpost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Get all posts
 export const getallposts = async (req, res) => {
  try {
    // Get page and limit from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many posts to skip
    const skip = (page - 1) * limit;

    // Get posts
    const allposts = await post
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total number of posts
    const totalPosts = await post.countDocuments();

    res.status(200).json({
      data: allposts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts: totalPosts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Like / Unlike a post
 export const likepost = async (req, res) => {
  const { id: _id } = req.params;
  const currentUserId = String(req.userid);

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(_id);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userIndex = postDoc.likes.findIndex(
      (id) => id === currentUserId
    );

    if (userIndex === -1) {
      // Like
      postDoc.likes.push(currentUserId);

      // Create notification only for someone else's post
      if (String(postDoc.userid) !== currentUserId) {
        await notification.create({
          recipient: String(postDoc.userid),
          sender: currentUserId,
          type: "like",
          postId: String(postDoc._id),
          message: "Someone liked your post",
        });
      }
    } else {
      // Unlike
      postDoc.likes = postDoc.likes.filter(
        (id) => id !== currentUserId
      );
    }

    await postDoc.save();

    res.status(200).json({
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Add a comment to a post
 export const addcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  if (!commentbody) {
    return res.status(400).json({
      message: "Comment is required",
    });
  }

  try {
    const postDoc = await post.findById(_id);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Add comment
    postDoc.comments.push({
      commentbody: commentbody,
      usercommented: req.userid,
      userid: req.userid,
    });

    await postDoc.save();

    // Comment notification for post owner
    if (String(postDoc.userid) !== String(req.userid)) {
      await notification.create({
        recipient: String(postDoc.userid),
        sender: String(req.userid),
        type: "comment",
        postId: String(postDoc._id),
        message: "Someone commented on your post",
      });
    }

    // Find mentions like @Bindu
    const mentionMatches =
      commentbody.match(/@([a-zA-Z0-9_]+)/g) || [];

    for (const mention of mentionMatches) {
      const mentionedName = mention.substring(1);

      const mentionedUser = await user.findOne({
        name: { $regex: `^${mentionedName}$`, $options: "i" },
      });

      // Mention notification
      if (
        mentionedUser &&
        String(mentionedUser._id) !== String(req.userid)
      ) {
        await notification.create({
          recipient: String(mentionedUser._id),
          sender: String(req.userid),
          type: "mention",
          postId: String(postDoc._id),
          message: "You were mentioned in a comment",
        });
      }
    }

    res.status(201).json({
      message: "Comment added successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Edit own comment
export const editcomment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  if (!commentbody) {
    return res.status(400).json({
      message: "Comment is required",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = postDoc.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Check comment owner
    if (comment.userid !== req.userid) {
      return res.status(403).json({
        message: "You can edit only your own comment",
      });
    }

    comment.commentbody = commentbody;

    await postDoc.save();

    res.status(200).json({
      message: "Comment updated successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Delete own comment
export const deletecomment = async (req, res) => {
  const { postId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = postDoc.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Check comment owner
    if (comment.userid !== req.userid) {
      return res.status(403).json({
        message: "You can delete only your own comment",
      });
    }

    comment.deleteOne();

    await postDoc.save();

    res.status(200).json({
      message: "Comment deleted successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Edit own reply
export const editreply = async (req, res) => {
  const { postId, commentId, replyId } = req.params;
  const { replybody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  if (!replybody) {
    return res.status(400).json({
      message: "Reply is required",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = postDoc.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        message: "Reply not found",
      });
    }

    // Check reply owner
    if (reply.userid !== req.userid) {
      return res.status(403).json({
        message: "You can edit only your own reply",
      });
    }

    reply.replybody = replybody;

    await postDoc.save();

    res.status(200).json({
      message: "Reply updated successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Delete own reply
export const deletereply = async (req, res) => {
  const { postId, commentId, replyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = postDoc.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        message: "Reply not found",
      });
    }

    // Check reply owner
    if (reply.userid !== req.userid) {
      return res.status(403).json({
        message: "You can delete only your own reply",
      });
    }

    reply.deleteOne();

    await postDoc.save();

    res.status(200).json({
      message: "Reply deleted successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Add a reply to a comment
export const addreply = async (req, res) => {
  const { postId, commentId } = req.params;
  const { replybody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  if (!replybody) {
    return res.status(400).json({
      message: "Reply is required",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = postDoc.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.replies.push({
      replybody: replybody,
      userreplied: req.userid,
      userid: req.userid,
    });

    await postDoc.save();

    res.status(201).json({
      message: "Reply added successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Bookmark / Remove Bookmark
export const bookmarkpost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(_id);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userIndex = postDoc.bookmarks.findIndex(
      (id) => id === String(req.userid)
    );

    if (userIndex === -1) {
      // Bookmark
      postDoc.bookmarks.push(String(req.userid));
    } else {
      // Remove bookmark
      postDoc.bookmarks = postDoc.bookmarks.filter(
        (id) => id !== String(req.userid)
      );
    }

    await postDoc.save();

    res.status(200).json({
      message:
        userIndex === -1
          ? "Post bookmarked successfully"
          : "Bookmark removed successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Share a post
export const sharepost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(_id);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    postDoc.shares += 1;

    await postDoc.save();

    res.status(200).json({
      message: "Post shared successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Get personalized feed
export const getfeed = async (req, res) => {
  try {
    const currentUser = await user.findById(req.userid);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const followingUsers = currentUser.following;

    const feedPosts = await post
      .find({
        userid: { $in: followingUsers },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Personalized feed fetched successfully",
      data: feedPosts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Get trending posts
export const gettrendingposts = async (req, res) => {
  try {
    const trendingPosts = await post.aggregate([
      {
        $addFields: {
          engagement: {
            $add: [
              { $size: "$likes" },
              { $size: "$comments" },
              "$shares",
            ],
          },
        },
      },
      {
        $sort: {
          engagement: -1,
          createdAt: -1,
        },
      },
      {
        $limit: 20,
      },
    ]);

    res.status(200).json({
      message: "Trending posts fetched successfully",
      data: trendingPosts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// Get posts by hashtag
export const getpostsbyhashtag = async (req, res) => {
  const { hashtag } = req.params;

  if (!hashtag) {
    return res.status(400).json({
      message: "Hashtag is required",
    });
  }

  try {
    const posts = await post.find({
      hashtags: {
        $regex: `^${hashtag}$`,
        $options: "i",
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const editpost = async (req, res) => {
  const { id: postId } = req.params;
  const { content, image, code, hashtags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Only post owner can edit
    if (String(postDoc.userid) !== String(req.userid)) {
      return res.status(403).json({
        message: "You can edit only your own post",
      });
    }

    postDoc.content = content ?? postDoc.content;
    postDoc.image = image ?? postDoc.image;
    postDoc.code = code ?? postDoc.code;
    postDoc.hashtags = hashtags ?? postDoc.hashtags;

    await postDoc.save();

    res.status(200).json({
      message: "Post updated successfully",
      data: postDoc,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const deletepost = async (req, res) => {
  const { id: postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Only post owner can delete
    if (String(postDoc.userid) !== String(req.userid)) {
      return res.status(403).json({
        message: "You can delete only your own post",
      });
    }

    await post.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};