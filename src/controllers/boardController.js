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

export const boardLike = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id }
  } = req.session;
  const user = await User.findById(_id);
  const board = await Board.findById(id);

  if (!board.likeOwner.includes(String(_id))) {
    board.likeOwner.push(String(_id));
  } else {
    board.likeOwner = board.likeOwner.filter((id) => id != _id);
  }
  board.save();

  if (!user.likes.includes(String(id))) {
    user.likes.push(String(id));
  } else {
    user.likes = user.likes.filter((boardId) => boardId != id);
  }
  user.save();
  req.session.user = user;

  return res.redirect("/");
};

export const boardScrap = async (req, res) => {
  const {
    user: { _id }
  } = req.session;
  const { id } = req.params;
  const user = await User.findById(_id);
  const board = await Board.findById(id);

  if (!board.scrapOwner.includes(String(_id))) {
    board.scrapOwner.push(String(_id));
  } else {
    board.scrapOwner = board.scrapOwner.filter((id) => id != _id);
  }
  board.save();

  if (!user.scraps.includes(String(id))) {
    user.scraps.push(String(id));
  } else {
    user.scraps = user.scraps.filter((boardId) => boardId != id);
  }
  user.save();
  req.session.user = user;
  return res.redirect("/");
};
