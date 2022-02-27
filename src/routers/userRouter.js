import express from "express";
import { userProfile } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", userProfile);
export default userRouter;
