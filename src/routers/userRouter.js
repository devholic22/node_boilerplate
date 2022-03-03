import express from "express";
import { userProfile, userScrap } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", userProfile);
userRouter.get("/:id/scraps", userScrap);

export default userRouter;
