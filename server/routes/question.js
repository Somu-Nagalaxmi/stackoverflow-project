 import express from "express";

import {
  Askquestion,
  deletequestion,
  getallquestion,
  votequestion,
} from "../controller/question.js";

import auth from "../middleware/auth.js";
import { checkQuestionLimit } from "../middleware/questionLimit.js";

const router = express.Router();


// Ask question
router.post(
  "/ask",
  auth,
  checkQuestionLimit,
  Askquestion
);


// Get all questions
router.get(
  "/getallquestion",
  getallquestion
);


// Delete question
router.delete(
  "/delete/:id",
  auth,
  deletequestion
);


// Vote question
router.patch(
  "/vote/:id",
  auth,
  votequestion
);


export default router;