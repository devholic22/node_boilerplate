import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  createdAt: { type: Date, required: true, default: Date.now() },
  likeOwner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  childComment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
