import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatarUrl: {
    type: String,
    default: "uploads/avatars/default_avatar.jpeg"
  },
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  scraps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  protection: { type: Boolean, default: false },
  needFollowAsk: { type: Boolean, default: false },
  blockUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const User = mongoose.model("User", userSchema);

export default User;
