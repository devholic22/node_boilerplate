import express from "express";
import {
  home,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  myProfile
} from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/logout", logout);
globalRouter.get("/my-profile", myProfile);

export default globalRouter;
