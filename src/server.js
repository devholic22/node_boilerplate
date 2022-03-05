import "./db";
import User from "./models/User";
import Board from "./models/Board";
import express from "express";
import morgan from "morgan";
import { logInMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import boardRouter from "./routers/boardRouter";
import userRouter from "./routers/userRouter";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const PORT = 4000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/nodeTemplate"
    })
  })
);
app.use(logInMiddleware);
app.use("/", globalRouter);
app.use("/boards", boardRouter);
app.use("/users", userRouter);

const handleListening = () => {
  console.log(`✅ Server listening on: http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
