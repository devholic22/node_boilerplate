import express from "express";
import {
  createComment,
  deleteComment,
  likeComment,
  createSmallComment
} from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post("/boards/:id/comment", createComment);
apiRouter.post("/comments/:id/delete", deleteComment);
apiRouter.post("/comments/:id/like", likeComment);
apiRouter.post("/comments/:id/comment", createSmallComment);

export default apiRouter;
