 
import express from "express";

import {
  getallusers,
  Login,
  Signup,
  updateprofile,
  followuser,
  getLoginHistory,
  getActiveSessions,
revokeSession,
 generateOTP,
 verifyOTP,
 addTrustedDevice,
 getTrustedDevices,
 removeTrustedDevice,
 forgotPasswordRequest,
  forgotPasswordVerify,
} from "../controller/auth.js";
import {
  sendLanguageOTP,
  verifyLanguageOTP,
} from "../controller/languageController.js";

const router = express.Router();
import auth from "../middleware/auth.js";
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/getalluser", getallusers);
router.get("/login-history", auth, getLoginHistory);
router.get("/sessions", auth, getActiveSessions);
router.get("/trusted-devices", auth, getTrustedDevices);
router.patch("/update/:id", auth,updateprofile);
router.patch("/follow/:id", auth, followuser);
router.patch("/sessions/:id/revoke", auth, revokeSession);
 router.post("/generate-otp", generateOTP);
 router.post("/verify-otp", verifyOTP);
 router.post(
  "/forgot-password",
  forgotPasswordRequest
);

router.post(
  "/forgot-password/verify",
  forgotPasswordVerify
);
 router.post("/trusted-device", auth, addTrustedDevice);
 router.delete(
  "/trusted-devices/:id",
  auth,
  removeTrustedDevice
);
router.post("/language/send-otp", auth, sendLanguageOTP);

router.post("/language/verify-otp", auth, verifyLanguageOTP);
export default router;
