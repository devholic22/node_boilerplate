import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  content: { type: String, required: true }
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
