import express from "express";
import { onlyLoggedIn } from "../middlewares";
import { getUpload, postUpload, watch } from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter
  .route("/upload")
  .get(onlyLoggedIn, getUpload)
  .post(onlyLoggedIn, postUpload);
boardRouter.get("/:id", watch);
export default boardRouter;
