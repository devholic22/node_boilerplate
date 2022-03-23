import multer from "multer";
import User from "./models/User";
import Board from "./models/Board";

export const logInMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

export const onlyAnon = (req, res, next) => {
  if (res.locals.loggedIn) {
    return res.redirect("/");
  }
  next();
};

export const onlyLoggedIn = (req, res, next) => {
  if (!res.locals.loggedIn) {
    return res.redirect("/");
  }
  next();
};

export const isUserEqualOwner = async (req, res, next) => {
  const { user } = req.session;
  const { id } = req.params;
  const owner = await User.findById(id);
  if (!owner || !user) {
    return res.redirect("/");
  }
  next();
};

export const isUserIdExist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    return res.redirect("/");
  }
};

export const isBoardIdExist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const board = await Board.findById(id);

    if (!board) {
      return res.redirect("/");
    }
  } catch (error) {
    return res.redirect("/");
  }

  next();
};

export const onlyBoardOwner = async (req, res, next) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  const board = await Board.findById(id);

  if (board.owner._id != _id) {
    return res.redirect("/");
  }

  next();
};

export const avatarUpload = multer({ dest: "uploads/avatars" });
