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

/* ✅ 1차 수정 완료 */
export const watch = async (req, res) => {
  const {
    params: { id }
  } = req;
  const board = await Board.findById(id).populate("owner");
  const comments = await Comment.find({ board })
    .populate("owner")
    .populate({ path: "childComments", model: "Comment", populate: "owner" });
  let sum = comments.length;
  comments.forEach((comment) => (sum += comment.childComments.length));
  return res.status(200).render("watch", { board, comments, sum });
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

/* ✅ 1차 수정 완료 */
export const boardLike = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById(_id);
  const board = await Board.findById(id);
  if (!board.likeOwner.includes(_id)) {
    board.likeOwner.push(_id);
  } else {
    board.likeOwner = board.likeOwner.filter((ownerId) => ownerId != _id);
  }
  board.save();

  if (!user.likes.includes(id)) {
    user.likes.push(id);
  } else {
    user.likes = user.likes.filter((boardId) => boardId != id);
  }
  user.save();
  req.session.user = user;

  return res.status(200).redirect(req.headers.referer);
};

/* ✅ 1차 수정 완료 */
export const boardScrap = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;
  const user = await User.findById(_id);
  const board = await Board.findById(id);

  if (!board.scrapOwner.includes(_id)) {
    board.scrapOwner.push(_id);
  } else {
    board.scrapOwner = board.scrapOwner.filter((ownerId) => ownerId != _id);
  }
  board.save();

  if (!user.scraps.includes(id)) {
    user.scraps.push(id);
  } else {
    user.scraps = user.scraps.filter((boardId) => boardId != id);
  }
  user.save();
  req.session.user = user;
  // 문제점: user's scrap page에서 scrap request를 보내면 바로 메인 페이지로 리다이렉트가 된다.
  // 실시간으로 변한 것을 보여주기 위해 user's scrap page를 다시 보내줄 수 있을까?
  // 해결 완료 (req.headers.referer)
  return res.status(200).redirect(req.headers.referer);
};

/* ✅ 1차 수정 완료 */
export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { value },
    session: {
      user: { _id }
    }
  } = req;

  const board = await Board.findById(id);
  const comment = await Comment.create({
    text: value,
    owner: _id,
    board: id
  });
  board.comments.push(comment._id);
  board.save();
  return res.sendStatus(201);
};

/* ✅ 1차 수정 완료 */
export const deleteComment = async (req, res) => {
  const {
    params: { id }
  } = req;
  const comment = await Comment.findById(id);
  console.log(comment.board._id);
  const isExist = comment.parentComment;
  if (Boolean(isExist)) {
    // 부모 코멘트가 있음 (대댓글임)
    const parent = await Comment.findOne({ childComments: id });
    parent.childComments = parent.childComments.filter(
      (commentId) => commentId != id
    );
    parent.save();
  } else {
    // 부모 코멘트가 없음 (자신이 부모 코멘트임)
    // 자신의 자식 댓글들을 모두 삭제하게 할까? 아니면 에타처럼 삭제된 댓글이라고 표시할까?
    // 일단 자식 댓글들도 모두 삭제되게 했음
    await Comment.find({ parentComment: comment }).deleteMany();

    const board = await Board.findById(comment.board._id);
    board.comments = board.comments.filter((commentId) => commentId != id);
    board.save();
  }
  comment.deleteOne();
  await Comment.findByIdAndDelete(id);
  return res.status(200).redirect(req.headers.referer);
};

/* ✅ 1차 수정 완료 */
export const likeComment = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  const comment = await Comment.findById(id);

  if (!comment.likeOwner.includes(_id)) {
    comment.likeOwner.push(_id);
  } else {
    comment.likeOwner = comment.likeOwner.filter((ownerId) => ownerId != _id);
  }
  comment.save();

  return res.status(200).redirect(req.headers.referer);
};

/* ✅ 1차 수정 완료 */
export const createSmallComment = async (req, res) => {
  const {
    params: { id },
    body: { value },
    session: {
      user: { _id }
    }
  } = req;

  const comment = await Comment.findById(id);
  const smallComment = await Comment.create({
    text: value,
    owner: _id,
    parentComment: comment._id
  });

  comment.childComments.push(smallComment._id);
  comment.save();

  return res.sendStatus(201);
};
