import express from "express";
import { home, getJoin, postJoin, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.get("/login", login);

export default globalRouter;
