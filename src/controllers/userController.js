import User from "../models/User";

export const home = (req, res) => {
  return res.render("home");
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

export const login = (req, res) => {
  return res.render("login");
};
