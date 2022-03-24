import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  board: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Board" },
  createdAt: { type: Date, required: true, default: Date.now() },
  likeOwner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  childComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  type: { type: String, enum: ["Parent", "Child"], required: true },
  status: { type: String, enum: ["Exist", "Deleted"], required: true }
});
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
