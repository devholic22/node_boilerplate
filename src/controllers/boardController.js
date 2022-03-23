import Board from "../models/Board";
import User from "../models/User";
import Comment from "../models/Comment";

/* ✅ 1차 수정 완료 */
export const home = async (req, res) => {
  const boards = await Board.find({}).populate("owner").populate("likeOwner");

  if (res.locals.loggedIn) {
    const {
      session: {
        user: { _id }
      }
    } = req;

    const user = await User.findById(_id);
    const sorted = boards.filter(
      (board) => !user.blockUsers.includes(board.owner._id)
    );

    return res.status(200).render("home", { boards: sorted });
  }

  return res.status(200).render("home", { boards });
};

/* ✅ 1차 수정 완료 */
export const getUpload = (req, res) => {
  return res.status(200).render("upload");
};

/* ✅ 1차 수정 완료 */
export const postUpload = async (req, res) => {
  const {
    body: { title, content },
    session: {
      user: { _id }
    }
  } = req;

  const board = await Board.create({
    title,
    content,
    owner: _id
  });

  const user = await User.findById(_id);
  user.boards.push(board._id);
  user.save();
  req.session.user = user;

  return res.status(201).redirect("/");
};

/* 🙅 아직 수정 안 했음 */
export const watch = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate("owner");
  const comments = await Comment.find({ board })
    .populate("owner")
    .populate({ path: "childComments", model: "Comment", populate: "owner" });
  let sum = comments.length;
  comments.forEach((comment) => (sum += comment.childComments.length));
  return res.render("watch", { board, comments, sum });
};

/* ✅ 1차 수정 완료 */
export const deleteBoard = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById(_id);
  await Board.findByIdAndDelete(id);

  user.boards = user.boards.filter((boardId) => boardId != id);
  user.save();
  req.session.user = user;

  return res.status(200).redirect("/");
};

/* ✅ 1차 수정 완료 */
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate("owner");

  return res.status(200).render("edit", { board });
};

/* ✅ 1차 수정 완료 */
export const postEdit = async (req, res) => {
  const {
    body: { title, content },
    params: { id }
  } = req;

  await Board.findByIdAndUpdate(id, {
    title,
    content
  });

  return res.status(200).redirect("/");
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
  // 문제점: user's scrap page에서 scrap request를 보내면 바로 메인 페이지로 리다이렉트가 된다.
  // 실시간으로 변한 것을 보여주기 위해 user's scrap page를 다시 보내줄 수 있을까?
  return res.redirect(req.headers.referer);
};

export const createComment = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const { user } = req.session;

  const board = await Board.findById(id);
  if (!board) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text: value,
    owner: user,
    board: id
  });
  board.comments.push(comment._id);
  board.save();
  return res.sendStatus(201);
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  const isExist = comment.parentComment;
  if (Boolean(isExist)) {
    // 부모 코멘트가 있음 (대댓글임)
    const parent = await Comment.findOne({ childComments: id });
    parent.childComments = parent.childComments.filter(
      (child) => String(child) != id
    );
    parent.save();
  } else {
    // 부모 코멘트가 없음 (자신이 부모 코멘트임)
    await Comment.find({ parentComment: comment }).deleteMany();
    const board = await Board.findById(String(comment.board));
    board.comments = board.comments.filter((value) => String(value) != id);
    board.save();
  }
  comment.deleteOne();
  await Comment.findByIdAndDelete(id);
  return res.redirect(req.headers.referer);
};

export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const comment = await Comment.findById(id);
  if (!user) {
    return res.redirect("/");
  }
  if (!comment.likeOwner.includes(user._id)) {
    comment.likeOwner.push(user._id);
  } else {
    comment.likeOwner = comment.likeOwner.filter((owner) => owner != user._id);
  }
  comment.save();
  return res.redirect(req.headers.referer);
};

export const createSmallComment = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const { user } = req.session;
  const comment = await Comment.findById(id);
  const smallComment = await Comment.create({
    text: value,
    owner: user._id,
    parentComment: comment._id
  });
  comment.childComments.push(smallComment._id);
  comment.save();
  return res.sendStatus(201);
};
