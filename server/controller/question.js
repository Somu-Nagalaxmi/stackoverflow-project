 
 import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";
import reputationHistory from "../models/reputationHistory.js";

// =====================================================
// HELPER FUNCTION
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

    const existingUser =
      await user.findById(userid);

    if (!existingUser) {
      return;
    }

    existingUser.reputation =
      (existingUser.reputation || 0) + points;

    // Reputation cannot go below 0
    if (existingUser.reputation < 0) {
      existingUser.reputation = 0;
    }

    await existingUser.save();

    // Save activity
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
// ASK QUESTION
// =====================================================

export const Askquestion = async (
  req,
  res
) => {
  const { postquestiondata } =
    req.body;

  try {
    const postques = new question({
      ...postquestiondata,

      // Make sure reward starts false
      questionRewardAwarded: false,
    });

    await postques.save();

    return res.status(200).json({
      data: postques,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// GET ALL QUESTIONS
// =====================================================

export const getallquestion = async (
  req,
  res
) => {
  try {
    const allquestion =
      await question
        .find()
        .sort({
          askedon: -1,
        });

    return res.status(200).json({
      data: allquestion,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// =====================================================
// DELETE QUESTION
// =====================================================

export const deletequestion = async (
  req,
  res
) => {
  const { id: _id } =
    req.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      _id
    )
  ) {
    return res.status(400).json({
      message:
        "question unavailable",
    });
  }

  try {
    await question.findByIdAndDelete(
      _id
    );

    return res.status(200).json({
      message: "question deleted",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "something went wrong..",
    });
  }
};

// =====================================================
// VOTE QUESTION
//
// Upvote 10 times = +2
// Downvote = -2
// =====================================================

export const votequestion = async (
  req,
  res
) => {
  const { id: _id } =
    req.params;

  const {
    value,
    userid,
  } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(
      _id
    )
  ) {
    return res.status(400).json({
      message:
        "question unavailable",
    });
  }

  try {
    const questionDoc =
      await question.findById(_id);

    if (!questionDoc) {
      return res.status(404).json({
        message:
          "Question not found",
      });
    }

    const userId =
      String(userid);

    const upindex =
      questionDoc.upvote.findIndex(
        (id) =>
          id === userId
      );

    const downindex =
      questionDoc.downvote.findIndex(
        (id) =>
          id === userId
      );

    // =================================================
    // UPVOTE
    // =================================================

    if (value === "upvote") {

      // User was previously downvoting
      if (downindex !== -1) {

        questionDoc.downvote =
          questionDoc.downvote.filter(
            (id) =>
              id !== userId
          );

        // Reverse -2
        await updateReputation(
          questionDoc.userid,
          2,
          "Downvote removed from question",
          "earned"
        );
      }

      // Add upvote
      if (upindex === -1) {

        questionDoc.upvote.push(
          userId
        );

      } else {

        // Remove upvote
        questionDoc.upvote =
          questionDoc.upvote.filter(
            (id) =>
              id !== userId
          );
      }
    }

    // =================================================
    // DOWNVOTE
    // =================================================

    else if (
      value === "downvote"
    ) {

      // Remove existing upvote
      if (upindex !== -1) {

        questionDoc.upvote =
          questionDoc.upvote.filter(
            (id) =>
              id !== userId
          );
      }

      // Add downvote
      if (downindex === -1) {

        questionDoc.downvote.push(
          userId
        );

        // -2 reputation
        await updateReputation(
          questionDoc.userid,
          -2,
          "Question received a downvote",
          "lost"
        );

      } else {

        // Remove downvote
        questionDoc.downvote =
          questionDoc.downvote.filter(
            (id) =>
              id !== userId
          );

        // Reverse -2
        await updateReputation(
          questionDoc.userid,
          2,
          "Downvote removed from question",
          "earned"
        );
      }
    }

    // =================================================
    // QUESTION 10 UPVOTES REWARD
    // +2 ONLY ONCE
    // =================================================

    if (
      questionDoc.upvote.length >= 10 &&
      !questionDoc.questionRewardAwarded
    ) {

      questionDoc.questionRewardAwarded =
        true;

      await updateReputation(
        questionDoc.userid,
        2,
        "Question received 10 upvotes",
        "earned"
      );
    }

    await questionDoc.save();

    return res.status(200).json({
      data: questionDoc,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "something went wrong..",
    });
  }
};