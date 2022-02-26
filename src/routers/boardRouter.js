import express from "express";
import { getUpload, postUpload } from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter.route("/upload").get(getUpload).post(postUpload);

export default boardRouter;
