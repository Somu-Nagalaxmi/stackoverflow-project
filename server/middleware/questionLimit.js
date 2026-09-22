import auth from "../models/auth.js";
import Question from "../models/question.js";

const questionLimit = {
  Free: 1,
  Bronze: 5,
  Silver: 15,
  Gold: Infinity,
};

export const checkQuestionLimit =
  async (req, res, next) => {

    try {

      const userid =
        req.userid.toString();

      const user =
        await auth.findById(userid);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const plan =
        user.subscriptionPlan ||
        "Free";

      const status =
        user.subscriptionStatus;

      let currentPlan = "Free";

      if (
        status === "active" &&
        ["Bronze", "Silver", "Gold"]
          .includes(plan)
      ) {
        currentPlan = plan;
      }

      const limit =
        questionLimit[currentPlan];

      // Gold
      if (limit === Infinity) {
        return next();
      }

      const startOfDay =
        new Date();

      startOfDay.setHours(
        0,
        0,
        0,
        0
      );

      const endOfDay =
        new Date();

      endOfDay.setHours(
        23,
        59,
        59,
        999
      );

      const todayCount =
        await Question.countDocuments({
          userid: userid,

          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

      if (todayCount >= limit) {
        return res.status(403).json({
          message:
            `${currentPlan} plan allows only ${limit} question(s) per day.`,
        });
      }

      next();

    } catch (error) {

      console.log(
        "Question limit error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to check question limit",
      });
    }
  };