 import report from "../models/report.js";
import post from "../models/post.js";
import user from "../models/auth.js";
import reputationHistory from "../models/reputationHistory.js";

// ======================================================
// GET ALL REPORTS
// ======================================================
export const getreports = async (req, res) => {
  try {
    const reports = await report
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// ======================================================
// REMOVE REPORTED POST BY ADMIN
// Reputation: -10
// ======================================================
export const removepost = async (req, res) => {
  const { id: postId } = req.params;

  // Check post ID
  if (!postId) {
    return res.status(400).json({
      message: "Post ID is required",
    });
  }

  // Check valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Invalid post ID",
    });
  }

  try {
    // Find post
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // ==========================================
    // GET POST OWNER
    // ==========================================

    const postOwnerId = postDoc.userid;

    // ==========================================
    // DELETE POST
    // ==========================================

    await post.findByIdAndDelete(postId);

    // ==========================================
    // DEDUCT -10 REPUTATION
    // ==========================================

    if (postOwnerId) {
      const postOwner = await user.findById(postOwnerId);

      if (postOwner) {
        const oldReputation = postOwner.reputation || 0;

        // Prevent reputation from going below 0
        postOwner.reputation = Math.max(
          0,
          oldReputation - 10
        );

        await postOwner.save();

        // ==========================================
        // SAVE REPUTATION HISTORY
        // ==========================================

        await reputationHistory.create({
          userid: String(postOwnerId),
          points: -10,
          reason:
            "Content removed by administrator due to guideline violation",
          type: "lost",
          relatedUserId: "",
        });
      }
    }

    // ==========================================
    // MARK REPORTS AS REVIEWED
    // ==========================================

    await report.updateMany(
      { postId: String(postId) },
      {
        $set: {
          status: "reviewed",
        },
      }
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      message:
        "Post removed successfully and 10 reputation points deducted",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// ======================================================
// SUSPEND USER
// ======================================================
export const suspenduser = async (req, res) => {
  const { id: userId } = req.params;

  // Check user ID
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  // Check valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  try {
    // Find user
    const existingUser = await user.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin cannot be suspended
    if (existingUser.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be suspended",
      });
    }

    // Suspend user
    existingUser.suspended = true;

    await existingUser.save();

    res.status(200).json({
      message: "User suspended successfully",
      data: existingUser,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};