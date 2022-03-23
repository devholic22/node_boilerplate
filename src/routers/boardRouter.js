import express from "express";
import { onlyLoggedIn, isBoardIdExist, onlyBoardOwner } from "../middlewares";
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
boardRouter.get("/:id", isBoardIdExist, watch);
boardRouter
  .route("/:id/edit")
  .get(isBoardIdExist, onlyLoggedIn, onlyBoardOwner, getEdit)
  .post(isBoardIdExist, onlyLoggedIn, onlyBoardOwner, postEdit);
boardRouter.get(
  "/:id/delete",
  isBoardIdExist,
  onlyLoggedIn,
  onlyBoardOwner,
  deleteBoard
);
boardRouter.post("/:id/like", onlyLoggedIn, boardLike);
boardRouter.post("/:id/scrap", boardScrap);

export default boardRouter;
