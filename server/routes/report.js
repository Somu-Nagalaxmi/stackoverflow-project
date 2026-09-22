import express from "express";
import { reportpost } from "../controller/report.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", auth, reportpost);

export default router;