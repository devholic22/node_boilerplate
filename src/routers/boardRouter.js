import express from "express";
import { upload } from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter.get("/upload", upload);

export default boardRouter;
