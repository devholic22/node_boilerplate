import express from "express";
import { isUserEqualOwner, isUserIdExist } from "../middlewares";
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
userRouter.get("/:id/scraps", userScrap);
userRouter.post("/:id/block", userBlock);
userRouter.get("/:id/block-users", blockedUser);
userRouter.post("/:id/follow", followFunction);
userRouter.get("/:id/follow-list", followList);
userRouter.post("/:id/follow-confirm", followConfirm);

export default userRouter;
