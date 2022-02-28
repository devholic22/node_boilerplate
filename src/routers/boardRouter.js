import express from "express";
import { onlyLoggedIn } from "../middlewares";
import {
  deleteBoard,
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  boardLike
} from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter
  .route("/upload")
  .get(onlyLoggedIn, getUpload)
  .post(onlyLoggedIn, postUpload);
boardRouter.get("/:id", watch);
boardRouter
  .route("/:id/edit")
  .get(onlyLoggedIn, getEdit)
  .post(onlyLoggedIn, postEdit);
boardRouter.get("/:id/delete", deleteBoard);
boardRouter.post("/:id/like", boardLike);

export default boardRouter;
