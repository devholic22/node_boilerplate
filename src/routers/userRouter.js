import express from "express";
import {
  userProfile,
  userScrap,
  userBlock
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", userProfile);
userRouter.get("/:id/scraps", userScrap);
userRouter.post("/:id/block", userBlock);

export default userRouter;
