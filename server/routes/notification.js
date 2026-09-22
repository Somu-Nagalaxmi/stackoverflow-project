import express from "express";
import {
  getnotifications,
  marknotificationread,
} from "../controller/notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getnotifications);

router.patch("/:id/read", auth, marknotificationread);

export default router;