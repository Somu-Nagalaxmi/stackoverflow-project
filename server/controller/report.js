import mongoose from "mongoose";
import report from "../models/report.js";
import post from "../models/post.js";

export const reportpost = async (req, res) => {
  const { id: postId } = req.params;
  const { reason } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      message: "Post unavailable",
    });
  }

  if (!reason) {
    return res.status(400).json({
      message: "Report reason is required",
    });
  }

  try {
    const postDoc = await post.findById(postId);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check if this user already reported the post
    const existingReport = await report.findOne({
      postId: String(postId),
      reportedBy: String(req.userid),
      status: "pending",
    });

    if (existingReport) {
      return res.status(400).json({
        message: "You already reported this post",
      });
    }

    const newReport = await report.create({
      postId: String(postId),
      reportedBy: String(req.userid),
      reason: reason,
    });

    res.status(201).json({
      message: "Post reported successfully",
      data: newReport,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};