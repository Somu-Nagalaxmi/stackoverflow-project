import express from "express";
import { getreports, removepost,suspenduser } from "../controller/admin.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// Get all reports
router.get("/reports", auth, admin, getreports);

// Remove reported post
router.delete("/post/:id", auth, admin, removepost);

// Suspend user
router.patch("/user/:id/suspend", auth, admin, suspenduser);

export default router;