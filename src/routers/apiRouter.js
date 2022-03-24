import express from "express";
import { onlyLoggedIn, isBoardIdExist } from "../middlewares";
import {
  createComment,
  deleteComment,
  likeComment,
  createSmallComment
} from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post(
  "/boards/:id/comment",
  isBoardIdExist,
  onlyLoggedIn,
  createComment
);
apiRouter.post("/comments/:id/delete", onlyLoggedIn, deleteComment);
apiRouter.post("/comments/:id/like", onlyLoggedIn, likeComment);
apiRouter.post("/comments/:id/comment", onlyLoggedIn, createSmallComment);

export default apiRouter;
