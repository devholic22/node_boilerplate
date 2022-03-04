import Board from "../models/Board";
import User from "../models/User";

export const home = async (req, res) => {
  const boards = await Board.find({}).populate("owner").populate("likeOwner");
  if (res.locals.loggedIn) {
    const {
      user: { _id }
    } = req.session;
    const user = await User.findById(_id);
    console.log(user);
    const sorted = boards.filter(
      (board) => !user.blockUsers.includes(board.owner._id)
    );
    console.log(boards);
    return res.render("home", { boards: sorted });
  } else {
    return res.render("home", { boards });
  }
};

export const join = (req, res) => {
  return res.render("join");
};

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const isExist = await User.exists({ email });
  if (isExist) {
    return res.render("join", { errorMsg: "🙅 This email is already taken!" });
  }
  if (password !== password2) {
    return res.render("join", { errorMsg: "🙅 password not correct!" });
  }
  await User.create({
    name,
    email,
    password
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.render("login", {
      errorMsg: "🙅 username/password does not correct!"
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const userProfile = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id }
  } = req.session;
  if (String(id) !== String(_id)) {
    const user = await User.findById(id).populate("boards");
    return res.render("user-profile", { user });
  } else {
    const user = await User.findById(_id).populate("boards");
    console.log(user);
    return res.render("user-profile", { user });
  }
};

export const getEditProfile = async (req, res) => {
  const { user: _id } = req.session;
  const user = await User.findById(_id);
  return res.render("edit-profile", { user });
};

export const postEditProfile = async (req, res) => {
  const { user: _id } = req.session;
  const { name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email
    },
    { new: true }
  );
  req.session.user = updatedUser;
  res.locals.loggedInUser = req.session.user;
  return res.redirect("/");
};

export const deleteUser = async (req, res) => {
  const { user: _id } = req.session;
  await Board.remove({ owner: _id });
  await User.findByIdAndDelete(_id);
  req.session.destroy();
  return res.redirect("/");
};

export const userScrap = async (req, res) => {
  const { id } = req.params;
  const scraps = [];
  const user = await User.findById(id).populate("scraps");

  // 중요 포인트 //
  for (const scrap of user.scraps) {
    const sorted = await Board.findById(scrap._id)
      .populate("owner")
      .populate("likeOwner");
    scraps.push(sorted);
  }

  return res.render("scraps", { boards: scraps });
};

export const userBlock = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id }
  } = req.session;
  if (String(id) !== String(_id)) {
    const user = await User.findById(_id);
    const blockUser = await User.findById(id);
    user.blockUsers.push(blockUser);
    user.save();
  }
  return res.redirect("/");
};
