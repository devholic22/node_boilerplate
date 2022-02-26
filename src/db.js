import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/nodeTemplate");

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = () => console.log("❌ DB Error");

const db = mongoose.connection;

db.on("error", handleError);
db.once("open", handleOpen);
