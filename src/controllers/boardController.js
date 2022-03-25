import Board from "../models/Board";
import User from "../models/User";
import Comment from "../models/Comment";

/* ✅ 2차 수정 완료 */
export const home = async (req, res) => {
  const boards = await Board.find({})
    .populate("owner")
    .populate("likeOwner")
    .populate("comments");
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

/* ✅ 2차 수정 완료 */
export const watch = async (req, res) => {
  const {
    params: { id }
  } = req;
  const board = await Board.findById(id).populate("owner");
  const parentComments = await Comment.find({ board, type: "Parent" })
    .populate("owner")
    .populate({ path: "childComments", model: "Comment", populate: "owner" });
  const boardExistComment = await Comment.find({ board, status: "Exist" });
  return res.status(200).render("watch", {
    board,
    comments: parentComments,
    sum: boardExistComment.length
  });
};

/* ✅ 2차 수정 완료 */
export const deleteBoard = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  // 1) 스크랩 한 유저들의 스크랩 목록에서 해당 보드 삭제
  const scrapOwners = await User.find({ scraps: id });
  scrapOwners.forEach((scrapOwner) => {
    scrapOwner.scraps = scrapOwner.scraps.filter((scrapId) => scrapId != id);
    scrapOwner.save();
  });

  // 2) 좋아요 한 유저들의 좋아요 목록에서 해당 보드 삭제
  const likeOwners = await User.find({ likes: id });
  likeOwners.forEach((likeOwner) => {
    likeOwner.likes = likeOwner.likes.filter((likeId) => likeId != id);
    likeOwner.save();
  });

  // 3) 유저의 보드 삭제, 보드 DB에서 삭제, 보드와 연관된 댓글 전부 삭제
  const user = await User.findById(_id);
  await Board.findByIdAndDelete(id);
  await Comment.find({ board: id }).deleteMany();

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
    board: id,
    type: "Parent",
    status: "Exist"
  });
  board.comments.push(comment._id);
  board.save();
  return res.sendStatus(201);
};

/* ✅ 2차 수정 완료 */
export const deleteComment = async (req, res) => {
  const {
    params: { id }
  } = req;
  const comment = await Comment.findById(id);
  const isParentExist = comment.parentComment;
  if (Boolean(isParentExist)) {
    // 부모 코멘트가 있음 (대댓글임)
    const parent = await Comment.findOne({ childComments: id });
    parent.childComments = parent.childComments.filter(
      (commentId) => commentId != id
    );
    parent.save();
    const board = await Board.findById(comment.board._id);
    board.comments = board.comments.filter((commentId) => commentId != id);
    board.save();
    await Comment.findByIdAndDelete(id);
  } else {
    // 부모 코멘트가 없음 (자신이 부모 코멘트임)
    const isChildExist = comment.childComments.length;
    // 자식 댓글이 있는 경우 삭제되었다고만 표시
    if (Boolean(isChildExist)) {
      comment.status = "Deleted";
      comment.text = "삭제된 댓글입니다.";
      comment.save();
    } else {
      // 자식 댓글이 없는 경우 즉시 삭제되도록 처리
      const board = await Board.findById(comment.board._id);
      board.comments = board.comments.filter((commentId) => commentId != id);
      board.save();
      await Comment.findByIdAndDelete(id);
    }
  }
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

/* ✅ 2차 수정 완료 */
export const createSmallComment = async (req, res) => {
  const {
    params: { id },
    body: { value },
    session: {
      user: { _id }
    }
  } = req;

  const parentComment = await Comment.findById(id).populate("board");

  const smallComment = await Comment.create({
    text: value,
    owner: _id,
    board: parentComment.board._id,
    parentComment: parentComment._id,
    type: "Child",
    status: "Exist"
  });

  parentComment.childComments.push(smallComment._id);
  parentComment.save();

  parentComment.board.comments.push(smallComment._id);
  parentComment.board.save();

  return res.sendStatus(201);
};
