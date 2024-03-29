import "./db";
import User from "./models/User";
import Board from "./models/Board";
import Comment from "./models/Comment";
import express from "express";
import morgan from "morgan";
import { logInMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import boardRouter from "./routers/boardRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

require("dotenv").config();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // get string, to change json object (parse)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL
    })
  })
);
app.use(logInMiddleware);
app.use("/", globalRouter);
app.use("/boards", boardRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

const handleListening = () => {
  console.log(
    `✅ Server listening on: http://localhost:${process.env.DEFAULT_PORT}`
  );
};

app.listen(process.env.DEFAULT_PORT, handleListening);
