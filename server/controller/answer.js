 import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";
import reputationHistory from "../models/reputationHistory.js";

// =====================================================
// HELPER FUNCTION
// ADD / REMOVE REPUTATION
// =====================================================

const updateReputation = async (
  userid,
  points,
  reason,
  type
) => {
  try {
    if (
      !userid ||
      !mongoose.Types.ObjectId.isValid(userid)
    ) {
      return;
    }

    const existingUser = await user.findById(userid);

    if (!existingUser) {
      return;
    }

    existingUser.reputation =
      (existingUser.reputation || 0) + points;

    // Reputation should never go below 0
    if (existingUser.reputation < 0) {
      existingUser.reputation = 0;
    }

    await existingUser.save();

    // Save reputation activity
    await reputationHistory.create({
      userid: String(userid),
      points: points,
      reason: reason,
      type: type,
    });
  } catch (error) {
    console.log(
      "Reputation update error:",
      error
    );
  }
};

// =====================================================
// ADD ANSWER
// +5 REPUTATION
// =====================================================

export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "question unavailable",
    });
  }

  const {
    noofanswer,
    answerbody,
    useranswered,
    userid,
  } = req.body;

  try {
    const questionDoc =
      await question.findById(_id);

    if (!questionDoc) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const newAnswer = {
      answerbody,
      useranswered,
      userid,
      answeredon: new Date(),

      accepted: false,

      answerRewardAwarded: false,

      answerUpvotes: [],

      answerDownvotes: [],
    };

    questionDoc.answer.push(newAnswer);

    questionDoc.noofanswer =
      questionDoc.answer.length;

    await questionDoc.save();

    // =============================================
    // +5 REPUTATION
    // =============================================

    await updateReputation(
      userid,
      5,
      "Posted an answer",
      "earned"
    );

    return res.status(200).json({
      data: questionDoc,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// DELETE ANSWER
// -5 REPUTATION
// =====================================================

export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;

  const {
    noofanswer,
    answerid,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "question unavailable",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(400).json({
      message: "answer unavailable",
    });
  }

  try {
    const questionDoc =
      await question.findById(_id);

    if (!questionDoc) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Find answer before deleting
    const answerToDelete =
      questionDoc.answer.id(answerid);

    if (!answerToDelete) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    const answerUserId =
      answerToDelete.userid;

    // Remove answer
    questionDoc.answer =
      questionDoc.answer.filter(
        (answer) =>
          String(answer._id) !==
          String(answerid)
      );

    questionDoc.noofanswer =
      questionDoc.answer.length;

    await questionDoc.save();

    // =============================================
    // -5 REPUTATION
    // =============================================

    await updateReputation(
      answerUserId,
      -5,
      "Deleted own answer",
      "lost"
    );

    return res.status(200).json({
      data: questionDoc,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// ACCEPT ANSWER
// +10 REPUTATION
// =====================================================

export const acceptanswer = async (
  req,
  res
) => {
  const { id: questionId } =
    req.params;

  const { answerid } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(
      questionId
    )
  ) {
    return res.status(400).json({
      message: "Question unavailable",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      answerid
    )
  ) {
    return res.status(400).json({
      message: "Answer unavailable",
    });
  }

  try {
    const questionDoc =
      await question.findById(questionId);

    if (!questionDoc) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Only question owner can accept
    if (
      String(questionDoc.userid) !==
      String(req.userid)
    ) {
      return res.status(403).json({
        message:
          "Only question owner can accept the answer",
      });
    }

    const selectedAnswer =
      questionDoc.answer.id(answerid);

    if (!selectedAnswer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    // Already accepted
    if (selectedAnswer.accepted) {
      return res.status(400).json({
        message:
          "Answer already accepted",
      });
    }

    // Check another accepted answer
    const alreadyAccepted =
      questionDoc.answer.find(
        (answer) =>
          answer.accepted === true
      );

    if (alreadyAccepted) {
      return res.status(400).json({
        message:
          "An answer is already accepted",
      });
    }

    selectedAnswer.accepted = true;

    await questionDoc.save();

    // =============================================
    // +10 REPUTATION
    // =============================================

    await updateReputation(
      selectedAnswer.userid,
      10,
      "Answer marked as accepted",
      "earned"
    );

    return res.status(200).json({
      message:
        "Answer accepted successfully",
      data: questionDoc,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// VOTE ANSWER
//
// Downvote = -2
// 5 Upvotes = +5
// =====================================================

export const voteanswer = async (
  req,
  res
) => {
  const { id: questionId } =
    req.params;

  const {
    answerid,
    value,
    userid,
  } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(
      questionId
    )
  ) {
    return res.status(400).json({
      message: "Question unavailable",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      answerid
    )
  ) {
    return res.status(400).json({
      message: "Answer unavailable",
    });
  }

  try {
    const questionDoc =
      await question.findById(questionId);

    if (!questionDoc) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const answer =
      questionDoc.answer.id(answerid);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    // =================================================
    // UPVOTE
    // =================================================

    if (value === "upvote") {
      const alreadyUpvoted =
        answer.answerUpvotes.includes(
          String(userid)
        );

      const alreadyDownvoted =
        answer.answerDownvotes.includes(
          String(userid)
        );

      // Remove downvote
      if (alreadyDownvoted) {
        answer.answerDownvotes =
          answer.answerDownvotes.filter(
            (id) =>
              id !== String(userid)
          );

        // Reverse previous -2
        await updateReputation(
          answer.userid,
          2,
          "Downvote removed from answer",
          "earned"
        );
      }

      // Add upvote
      if (!alreadyUpvoted) {
        answer.answerUpvotes.push(
          String(userid)
        );
      } else {
        // Remove upvote
        answer.answerUpvotes =
          answer.answerUpvotes.filter(
            (id) =>
              id !== String(userid)
          );
      }
    }

    // =================================================
    // DOWNVOTE
    // =================================================

    else if (value === "downvote") {
      const alreadyDownvoted =
        answer.answerDownvotes.includes(
          String(userid)
        );

      const alreadyUpvoted =
        answer.answerUpvotes.includes(
          String(userid)
        );

      // Remove upvote
      if (alreadyUpvoted) {
        answer.answerUpvotes =
          answer.answerUpvotes.filter(
            (id) =>
              id !== String(userid)
          );
      }

      // Add downvote
      if (!alreadyDownvoted) {
        answer.answerDownvotes.push(
          String(userid)
        );

        // -2 reputation
        await updateReputation(
          answer.userid,
          -2,
          "Answer received a downvote",
          "lost"
        );
      } else {
        // Remove downvote
        answer.answerDownvotes =
          answer.answerDownvotes.filter(
            (id) =>
              id !== String(userid)
          );

        // Reverse previous -2
        await updateReputation(
          answer.userid,
          2,
          "Downvote removed from answer",
          "earned"
        );
      }
    }

    // =================================================
    // 5 UPVOTES REWARD
    // =================================================

    if (
      answer.answerUpvotes.length >= 5 &&
      !answer.answerRewardAwarded
    ) {
      answer.answerRewardAwarded = true;

      await updateReputation(
        answer.userid,
        5,
        "Answer received 5 upvotes",
        "earned"
      );
    }

    await questionDoc.save();

    return res.status(200).json({
      message:
        "Answer vote updated successfully",
      data: questionDoc,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
