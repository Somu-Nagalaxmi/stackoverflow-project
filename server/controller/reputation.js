import mongoose from "mongoose";
import user from "../models/auth.js";
import reputationHistory from "../models/reputationHistory.js";
import reputationTransfer from "../models/reputationTransfer.js";
 

// =====================================================
// GET MY REPUTATION
// =====================================================

export const getMyReputation = async (req, res) => {
  try {
    const existingUser = await user.findById(req.userid);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      reputation: existingUser.reputation || 0,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// GET REPUTATION HISTORY
// =====================================================

export const getReputationHistory = async (req, res) => {
  try {
    const history = await reputationHistory
      .find({
        userid: String(req.userid),
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: "Reputation history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// TRANSFER REPUTATION
// =====================================================

export const transferReputation = async (req, res) => {
  const senderId = String(req.userid);

  const {
    receiverId,
    points,
    reason,
  } = req.body;

  // Basic validation
  if (!receiverId || !points || !reason) {
    return res.status(400).json({
      message:
        "Receiver, points and reason are required",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    return res.status(400).json({
      message: "Invalid receiver",
    });
  }

  const transferPoints = Number(points);

  if (
    !Number.isInteger(transferPoints) ||
    transferPoints <= 0
  ) {
    return res.status(400).json({
      message: "Points must be a positive integer",
    });
  }

  // Maximum 50 points per transaction
  if (transferPoints > 50) {
    return res.status(400).json({
      message:
        "Maximum 50 reputation points can be transferred per transaction",
    });
  }

  // Cannot transfer to yourself
  if (senderId === String(receiverId)) {
    return res.status(400).json({
      message:
        "You cannot transfer reputation to yourself",
    });
  }

  try {
    const sender = await user.findById(senderId);
    const receiver = await user.findById(receiverId);

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found",
      });
    }

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    // Sender must have MORE than 50 reputation
    if ((sender.reputation || 0) <= 50) {
      return res.status(400).json({
        message:
          "You must have more than 50 reputation points to transfer",
      });
    }

    // Check enough reputation
    if (
      (sender.reputation || 0) < transferPoints
    ) {
      return res.status(400).json({
        message: "Insufficient reputation points",
      });
    }

    // =================================================
    // DAILY LIMIT = 100
    // =================================================

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayTransfers =
      await reputationTransfer.find({
        sender: senderId,
        timestamp: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

    const totalTransferredToday =
      todayTransfers.reduce(
        (total, transfer) =>
          total + transfer.points,
        0
      );

    if (
      totalTransferredToday + transferPoints >
      100
    ) {
      return res.status(400).json({
        message:
          "Maximum 100 reputation points can be transferred per day",
      });
    }

    // =================================================
    // UPDATE REPUTATION
    // =================================================

    sender.reputation -= transferPoints;

    receiver.reputation =
      (receiver.reputation || 0) +
      transferPoints;

    await sender.save();
    await receiver.save();

    // =================================================
    // SAVE TRANSFER RECORD
    // =================================================

    const transfer =
      await reputationTransfer.create({
        sender: senderId,
        receiver: String(receiverId),
        points: transferPoints,
        reason: reason,
        timestamp: new Date(),
      });

    // =================================================
    // SENDER HISTORY
    // =================================================

    await reputationHistory.create({
      userid: senderId,
      points: -transferPoints,
      reason: `Transferred ${transferPoints} reputation: ${reason}`,
      type: "transfer_sent",
      relatedUserId: String(receiverId),
    });

    // =================================================
    // RECEIVER HISTORY
    // =================================================

    await reputationHistory.create({
      userid: String(receiverId),
      points: transferPoints,
      reason: `Received ${transferPoints} reputation: ${reason}`,
      type: "transfer_received",
      relatedUserId: senderId,
    });

    return res.status(200).json({
      message:
        "Reputation transferred successfully",

      data: {
        senderReputation: sender.reputation,
        receiverReputation: receiver.reputation,
        transfer,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// TRANSFER HISTORY
// =====================================================

export const getTransferHistory = async (
  req,
  res
) => {
  try {
    const userid = String(req.userid);

    const history =
      await reputationTransfer
        .find({
          $or: [
            { sender: userid },
            { receiver: userid },
          ],
        })
        .sort({
          timestamp: -1,
        });

    return res.status(200).json({
      message:
        "Transfer history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// COMMUNITY PRIVILEGES
// =====================================================

export const getPrivileges = async (req, res) => {
  try {
    const existingUser =
      await user.findById(req.userid);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const reputation =
      existingUser.reputation || 0;

    return res.status(200).json({
      reputation,

      privileges: {
        commenting: reputation >= 50,

        editCommunityPosts:
          reputation >= 100,

        voteToCloseQuestions:
          reputation >= 250,

        reportContent:
          reputation >= 500,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// PROFILE COMPLETION REWARD
// +10 ONE TIME
// =====================================================

export const completeProfileReward = async (
  req,
  res
) => {
  try {
    const existingUser =
      await user.findById(req.userid);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already received
    if (existingUser.profileBonusAwarded) {
      return res.status(400).json({
        message:
          "Profile completion reward already received",
      });
    }

    // Mandatory profile details
    const profileCompleted =
      existingUser.name &&
      existingUser.email &&
      existingUser.phone &&
      existingUser.about &&
      existingUser.tags &&
      existingUser.tags.length > 0;

    if (!profileCompleted) {
      return res.status(400).json({
        message:
          "Please complete all mandatory profile details",
      });
    }

    // +10 reputation
    existingUser.reputation =
      (existingUser.reputation || 0) + 10;

    existingUser.profileBonusAwarded = true;

    await existingUser.save();

    // Save history
    await reputationHistory.create({
      userid: String(existingUser._id),
      points: 10,
      reason: "Completed mandatory user profile",
      type: "earned",
    });

    return res.status(200).json({
      message:
        "Profile completed successfully. 10 reputation points awarded.",
      reputation:
        existingUser.reputation,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// ======================================================
// GET PUBLIC USER REPUTATION + HISTORY
// ======================================================
 export const getPublicReputation = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "User unavailable",
    });
  }

  try {
    const existingUser = await user
      .findById(id)
      .select(
        "name email phone about tags reputation joinDate"
      );

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const history =
      await reputationHistory
        .find({
          userid: String(id),
        })
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      data: {
        user: existingUser,
        history,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};