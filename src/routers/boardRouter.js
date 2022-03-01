import express from "express";
import { onlyLoggedIn } from "../middlewares";
import {
  deleteBoard,
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  boardLike,
  boardScrap
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
boardRouter.get("/:id/delete", onlyLoggedIn, deleteBoard);
boardRouter.post("/:id/like", onlyLoggedIn, boardLike);
boardRouter.post("/:id/scrap", boardScrap);

export default boardRouter;
