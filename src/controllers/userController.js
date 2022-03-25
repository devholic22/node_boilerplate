import Board from "../models/Board";
import User from "../models/User";
import bcrypt from "bcrypt";

/* ✅ 1차 수정 완료 */
export const getJoin = (req, res) => {
  return res.status(200).render("join");
};

/* ✅ 1차 수정 완료 */
export const postJoin = async (req, res) => {
  const {
    body: { name, email, password, password2 }
  } = req;

  const isExist = await User.exists({ email });
  if (isExist) {
    return res
      .status(400)
      .render("join", { errorMsg: "🙅 This email is already taken!" });
  }

  if (password !== password2) {
    return res
      .status(400)
      .render("join", { errorMsg: "🙅 password not correct!" });
  }

  await User.create({
    name,
    email,
    password: await User.passwordHash(password)
  });

  return res.status(201).redirect("/login");
};

/* ✅ 1차 수정 완료 */
export const getLogin = (req, res) => {
  return res.status(200).render("login");
};

/* ✅ 1차 수정 완료 */
export const postLogin = async (req, res) => {
  const {
    body: { email, password }
  } = req;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).render("login", {
      errorMsg: "🙅 This username does not exist."
    });
  }

  const isPasswordCorrect = Boolean(
    bcrypt.compareSync(password, user.password)
  );

  if (!isPasswordCorrect) {
    return res.status(400).render("login", {
      errorMsg: "🙅 Password doesn't correct."
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.status(200).redirect("/");
};

/* ✅ 1차 수정 완료 */
export const logout = (req, res) => {
  req.session.destroy();
  return res.status(200).redirect("/");
};

export const userProfile = async (req, res) => {
  const { id } = req.params;
  if (res.locals.loggedIn) {
    const {
      user: { _id }
    } = req.session;
    if (String(id) != String(_id)) {
      const user = await User.findById(id)
        .populate("boards")
        .populate("followUsers")
        .populate("followingUsers");
      return res.render("user-profile", { user });
    } else {
      const user = await User.findById(_id)
        .populate("boards")
        .populate("followUsers")
        .populate("followingUsers");
      return res.render("user-profile", { user });
    }
  } else {
    const user = await User.findById(id)
      .populate("boards")
      .populate("followUsers")
      .populate("followingUsers");
    return res.render("user-profile", { user });
  }
};

/* ✅ 1차 수정 완료 */
export const getEditProfile = async (req, res) => {
  const {
    session: {
      user: { _id }
    }
  } = req;
  const user = await User.findById(_id);
  return res.status(200).render("edit-profile", { user });
};

export const postEditProfile = async (req, res) => {
  const { user: _id } = req.session;
  const { name, email, protection, needFollowAsk } = req.body;
  if (req.file) {
    const avatarUrl = req.file.path;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        protection,
        needFollowAsk,
        avatarUrl
      },
      { new: true }
    );
    req.session.user = updatedUser;
    res.locals.loggedInUser = req.session.user;
    return res.redirect("/");
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        protection,
        needFollowAsk
      },
      { new: true }
    );
    req.session.user = updatedUser;
    res.locals.loggedInUser = req.session.user;
    return res.redirect("/");
  }
};

/* ✅ 1차 수정 완료 */
export const getChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id }
    }
  } = req;
  const user = await User.findById(_id);
  return res.status(200).render("change-password", { user });
};

export const postChangePassword = async (req, res) => {
  const {
    user: { _id }
  } = req.session;
  const user = await User.findById(_id);
  const { password, password2 } = req.body;
  const isPasswordCorrect = Boolean(
    bcrypt.compareSync(password, user.password)
  );
  if (!isPasswordCorrect) {
    return res.render("change-password", {
      errorMsg: "🙅 Origin password doesn't correct!"
    });
  } else {
    const isPasswordExist = Boolean(password === password2);
    if (isPasswordExist) {
      return res.render("change-password", {
        errorMsg: "🙅 Origin password same with new password!"
      });
    } else {
      user.password = await User.passwordHash(password2);
      user.save();
      req.session.destroy();
      return res.redirect("/");
    }
  }
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
    if (user.blockUsers.includes(String(blockUser._id))) {
      user.blockUsers = user.blockUsers.filter(
        (id) => String(id) != String(blockUser._id)
      );
    } else {
      user.blockUsers.push(String(blockUser._id));
    }
    user.save();
    req.session.user = user;
  }
  return res.redirect(req.headers.referer);
};

/* ✅ 1차 수정 완료 */
export const blockedUser = async (req, res) => {
  const {
    params: { id }
  } = req;

  const user = await User.findById(id).populate("blockUsers");

  return res.status(200).render("blocked-user", { users: user.blockUsers });
};

/* ✅ 1차 수정 완료 */
export const followFunction = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById(id);
  const wantedUser = await User.findById(_id);

  if (user.followUsers.includes(wantedUser._id)) {
    user.followUsers = user.followUsers.filter(
      (listId) => listId != wantedUser._id
    );
    wantedUser.followingUsers = wantedUser.followingUsers.filter(
      (listId) => listId != user._id
    );
  } else {
    if (Boolean(user.needFollowAsk)) {
      if (user.followList.includes(wantedUser._id)) {
        user.followList = user.followList.filter(
          (listId) => listId != wantedUser._id
        );
      } else {
        user.followList.push(wantedUser._id);
      }
    } else {
      user.followUsers.push(wantedUser._id);
      wantedUser.followingUsers.push(user._id);
    }
  }

  user.save();
  wantedUser.save();
  req.session.user = wantedUser;

  return res.status(200).redirect(req.headers.referer);
};

/* ✅ 1차 수정 완료 */
export const followList = async (req, res) => {
  const {
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById(_id).populate("followList");

  return res.status(200).render("follow-list", { users: user.followList });
};

/* ✅ 1차 수정 완료 */
export const followConfirm = async (req, res) => {
  const {
    params: { id },
    body: { confirm },
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById(id);
  const listOwner = await User.findById(_id);

  if (confirm === "Accept") {
    listOwner.followUsers.push(user._id);
    user.followingUsers.push(listOwner._id);
  }
  listOwner.followList = listOwner.followList.filter(
    (listId) => listId != user._id
  );

  user.save();
  listOwner.save();
  req.session.user = listOwner;

  return res.status(200).redirect(req.headers.referer);
};
