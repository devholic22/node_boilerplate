import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  board: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Board" },
  createdAt: { type: String, required: true },
  likeOwner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  childComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  type: { type: String, enum: ["Parent", "Child"], required: true },
  status: { type: String, enum: ["Exist", "Deleted"], required: true }
});
commentSchema.static("timeFormat", () => {
  const date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  const result = `${year}/${month}/${day} ${hour}:${min}`;

  return result;
});
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
