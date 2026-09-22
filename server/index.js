 import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userroutes from "./routes/auth.js";
import questionroute from "./routes/question.js";
import answerroutes from "./routes/answer.js";
import postroutes from "./routes/post.js";
import notificationroutes from "./routes/notification.js";
import reportroutes from "./routes/report.js";
import adminroutes from "./routes/admin.js";
import reputationRoutes from "./routes/reputation.js";
import subscriptionRoutes from "./routes/subscription.js";

const app = express();
 

// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json({
    limit: "30mb",
    verify: (req, res, buf) => {
      // Razorpay webhook kosam raw body save chestham
      if (
        req.originalUrl ===
        "/subscription/webhook"
      ) {
        req.rawBody = buf;
      }
    },
  })
);

app.use(
  express.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

app.use(cors());


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.send(
    "Stackoverflow clone is running perfect"
  );
});


// =====================================================
// EXISTING ROUTES
// =====================================================

app.use(
  "/user",
  userroutes
);

app.use(
  "/question",
  questionroute
);

app.use(
  "/answer",
  answerroutes
);

app.use(
  "/post",
  postroutes
);

app.use(
  "/notification",
  notificationroutes
);

app.use(
  "/report",
  reportroutes
);

app.use(
  "/admin",
  adminroutes
);

app.use(
  "/reputation",
  reputationRoutes
);


// =====================================================
// SUBSCRIPTION ROUTES
// =====================================================

app.use(
  "/subscription",
  subscriptionRoutes
);


// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

const databaseurl =
  process.env.MONGODB_URL;

mongoose
  .connect(databaseurl)
  .then(() => {

    console.log(
      "✅ Connected to MongoDB"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );
      }
    );

  })
  .catch((err) => {

    console.error(
      "❌ MongoDB connection error:",
      err.message
    );

  });