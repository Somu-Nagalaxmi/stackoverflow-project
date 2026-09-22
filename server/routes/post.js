import express from "express";

 
import {
  createpost,
  getallposts,
  likepost,
  addcomment,
   addreply,
   editcomment,
  deletecomment,
   editreply,
   deletereply,
   bookmarkpost,
   sharepost,
   getfeed,
   gettrendingposts,
   getpostsbyhashtag,
     editpost,
     deletepost,
} from "../controller/post.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createpost);

router.get("/getallposts", getallposts);

router.patch("/like/:id", auth, likepost);

router.post("/comment/:id", auth, addcomment);

router.post("/reply/:postId/:commentId", auth, addreply);

router.patch("/comment/:postId/:commentId", auth, editcomment);

router.delete("/comment/:postId/:commentId", auth, deletecomment);

router.patch("/reply/:postId/:commentId/:replyId", auth,editreply);

router.delete(
  "/reply/:postId/:commentId/:replyId",
  auth,
  deletereply
);

router.patch("/bookmark/:id", auth, bookmarkpost);

router.patch("/share/:id", auth, sharepost);

router.get("/feed", auth, getfeed);

router.get("/trending", gettrendingposts);

router.get("/hashtag/:hashtag", getpostsbyhashtag);

router.patch("/edit/:id", auth, editpost);

router.delete("/delete/:id", auth, deletepost);
export default router;