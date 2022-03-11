import express from "express";
import { onlyAnon, onlyLoggedIn, avatarUpload } from "../middlewares";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  getEditProfile,
  postEditProfile,
  deleteUser,
  getChangePassword,
  postChangePassword
} from "../controllers/userController";
import { home } from "../controllers/boardController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(onlyAnon, getJoin).post(onlyAnon, postJoin);
globalRouter.route("/login").get(onlyAnon, getLogin).post(onlyAnon, postLogin);
globalRouter.get("/logout", onlyLoggedIn, logout);
globalRouter
  .route("/edit-profile")
  .get(onlyLoggedIn, getEditProfile)
  .post(onlyLoggedIn, avatarUpload.single("avatar"), postEditProfile);
globalRouter.get("/delete-user", deleteUser);
globalRouter
  .route("/change-password")
  .get(onlyLoggedIn, getChangePassword)
  .post(onlyLoggedIn, postChangePassword);
export default globalRouter;
