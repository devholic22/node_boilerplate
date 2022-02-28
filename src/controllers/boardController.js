import Board from "../models/Board";
import User from "../models/User";

export const getUpload = (req, res) => {
  return res.render("upload");
};

export const postUpload = async (req, res) => {
  const { title, content } = req.body;
  const {
    user: { _id }
  } = req.session;
  const board = await Board.create({
    title,
    content,
    owner: _id
  });
  console.log("UPLOADED: ", board);
  const user = await User.findById(_id);
  user.boards.push(board.id);
  user.save();
  req.session.user = user;
  return res.redirect("/");
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate("owner");
  return res.render("watch", { board });
};

export const deleteBoard = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id }
  } = req.session;
  const board = await Board.findById(id);
  const user = await User.findById(_id);
  if (
    req.session.user &&
    String(req.session.user._id) !== String(board.owner._id)
  ) {
    return res.redirect("/");
  }
  const deleteBoard = await Board.findByIdAndDelete(id);
  user.boards = user.boards.filter((board) => String(board) != deleteBoard._id);
  console.log("AAAAAAAA", user.boards);
  user.save();
  req.session.user = user;
  return res.redirect("/");
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate("owner");
  if (
    req.session.user &&
    String(req.session.user._id) !== String(board.owner._id)
  ) {
    return res.redirect("/");
  }
  return res.render("edit", { board });
};

export const postEdit = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  await Board.findByIdAndUpdate(id, {
    title,
    content
  });
  return res.redirect("/");
};
