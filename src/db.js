import mongoose from "mongoose";
import dotenv from "dotenv";

require("dotenv").config();

mongoose.connect(process.env.DB_URL);

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = () => console.log("❌ DB Error");

const db = mongoose.connection;

db.on("error", handleError);
db.once("open", handleOpen);
