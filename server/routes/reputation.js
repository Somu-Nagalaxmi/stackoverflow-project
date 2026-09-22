import express from "express";

import {
  getMyReputation,
  getReputationHistory,
  transferReputation,
  getTransferHistory,
  getPrivileges,
  completeProfileReward,
   getPublicReputation,
} from "../controller/reputation.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// My reputation
router.get(
  "/my",
  auth,
  getMyReputation
);

// Reputation activity history
router.get(
  "/history",
  auth,
  getReputationHistory
);

// Transfer reputation
router.post(
  "/transfer",
  auth,
  transferReputation
);

// Transfer history
router.get(
  "/transfer-history",
  auth,
  getTransferHistory
);

// Community privileges
router.get(
  "/privileges",
  auth,
  getPrivileges
);

// Profile completion reward
router.post(
  "/profile-complete",
  auth,
  completeProfileReward
);

router.get("/public/:id", getPublicReputation);
export default router;