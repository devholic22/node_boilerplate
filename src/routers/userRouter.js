import express from "express";
import { onlyLoggedIn, isUserEqualOwner, isUserIdExist } from "../middlewares";
import {
  userProfile,
  userScrap,
  userBlock,
  blockedUser,
  followFunction,
  followList,
  followConfirm
} from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/:id", isUserIdExist, userProfile);
userRouter.get("/:id/scraps", onlyLoggedIn, isUserEqualOwner, userScrap);
userRouter.post("/:id/block", onlyLoggedIn, isUserEqualOwner, userBlock);
userRouter.get("/:id/block-users", onlyLoggedIn, isUserEqualOwner, blockedUser);
userRouter.post("/:id/follow", onlyLoggedIn, followFunction);
userRouter.get("/:id/follow-list", onlyLoggedIn, isUserEqualOwner, followList);
userRouter.post("/:id/follow-confirm", onlyLoggedIn, followConfirm);

export default userRouter;
