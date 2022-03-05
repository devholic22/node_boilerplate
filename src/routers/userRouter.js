import express from "express";
import {
  userProfile,
  userScrap,
  userBlock,
  blockedUser,
  followFunction
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", userProfile);
userRouter.get("/:id/scraps", userScrap);
userRouter.post("/:id/block", userBlock);
userRouter.get("/:id/block-users", blockedUser);
userRouter.post("/:id/follow", followFunction);

export default userRouter;
