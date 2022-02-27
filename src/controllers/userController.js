import Board from "../models/Board";
import User from "../models/User";

export const home = async (req, res) => {
  const boards = await Board.find({}).populate("owner");
  return res.render("home", { boards });
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
    console.log("aaaaaa");
    return res.render("login", {
      errorMsg: "🙅 username/password does not correct!"
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("AFTER LOGIN", req.session);
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const myProfile = async (req, res) => {
  const { user: _id } = req.session;
  const user = await User.findById(_id).populate("boards");
  return res.render("my-profile", { user });
};

export const userProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("boards");
  return res.render("user-profile", { user });
};
