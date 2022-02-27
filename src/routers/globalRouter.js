import express from "express";
import { onlyAnon, onlyLoggedIn } from "../middlewares";
import {
  home,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  myProfile,
  getEditProfile,
  postEditProfile
} from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(onlyAnon, getJoin).post(onlyAnon, postJoin);
globalRouter.route("/login").get(onlyAnon, getLogin).post(onlyAnon, postLogin);
globalRouter.get("/logout", onlyLoggedIn, logout);
globalRouter.get("/my-profile", onlyLoggedIn, myProfile);
globalRouter
  .route("/edit-profile")
  .get(onlyLoggedIn, getEditProfile)
  .post(onlyLoggedIn, postEditProfile);
export default globalRouter;
