import "./db";
import User from "./models/User";
import express from "express";
import morgan from "morgan";
import { logInMiddleware } from "./middlewares";
import globalRouter from "./routers/globalRouter";
import boardRouter from "./routers/boardRouter";
import userRouter from "./routers/userRouter";
import session from "express-session";

const app = express();
const PORT = 4000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: false
  })
);
app.use(logInMiddleware);
app.use("/", globalRouter);
app.use("/board", boardRouter);
app.use("/user", userRouter);

const handleListening = () => {
  console.log(`✅ Server listening on: http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
