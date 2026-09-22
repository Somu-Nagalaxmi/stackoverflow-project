 import express from "express";

import {
  getPlans,
  createSubscription,
  verifySubscriptionPayment,
  getMySubscription,
  getPaymentHistory,
  downloadInvoice,
  razorpayWebhook,
} from "../controller/subscription.js";

import auth from "../middleware/auth.js";

const router = express.Router();


// Public
router.get(
  "/plans",
  getPlans
);


// Protected
router.post(
  "/create",
  auth,
  createSubscription
);

router.post(
  "/verify",
  auth,
  verifySubscriptionPayment
);

router.get(
  "/my",
  auth,
  getMySubscription
);

router.get(
  "/payments",
  auth,
  getPaymentHistory
);

router.get(
  "/invoice/:id",
  auth,
  downloadInvoice
);


// Razorpay webhook
router.post(
  "/webhook",
  razorpayWebhook
);


export default router;