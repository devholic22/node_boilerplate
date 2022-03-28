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

/* ✅ 1차 수정 완료 */
export const userProfile = async (req, res) => {
  const loggedInUserList = [];

  // 왜 await이 적용이 안 되냐...
  await req.sessionStore.all((error, sessions) => {
    sessions.forEach((session) => {
      loggedInUserList.push(session.user._id);
      console.log("세 번째에 떠야 한다", loggedInUserList);
    });
  });

  const {
    params: { id }
  } = req;

  console.log("네 번째에 떠야 한다", loggedInUserList);
  const isUserLogin = Boolean(loggedInUserList.includes(String(id)));
  console.log("마지막에 떠야 한다", isUserLogin);

  const user = await User.findById(id)
    .populate("boards")
    .populate("followUsers")
    .populate("followingUsers");
  return res.status(200).render("user-profile", { user });
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

/* ✅ 1차 수정 완료 */
export const postEditProfile = async (req, res) => {
  const {
    session: {
      user: { _id }
    },
    body: { name, email, protection, needFollowAsk }
  } = req;

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
  }
  res.locals.loggedInUser = req.session.user;
  return res.status(200).redirect("/");
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

/* ✅ 1차 수정 완료 */
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id }
    },
    body: { password, password2 }
  } = req;
  const user = await User.findById(_id);
  const isPasswordCorrect = Boolean(
    bcrypt.compareSync(password, user.password)
  );
  if (!isPasswordCorrect) {
    return res.status(400).render("change-password", {
      errorMsg: "🙅 Origin password doesn't correct!"
    });
  } else {
    const isPasswordExist = Boolean(password === password2);
    if (isPasswordExist) {
      return res.status(400).render("change-password", {
        errorMsg: "🙅 Origin password same with new password!"
      });
    } else {
      user.password = await User.passwordHash(password2);
      user.save();
      req.session.destroy();
      return res.status(200).redirect("/");
    }
  }
};

/* ✅ 1차 수정 완료 */
export const deleteUser = async (req, res) => {
  const {
    session: {
      user: { _id }
    }
  } = req;
  // 유저 조회
  const user = await User.findById(_id);

  // 유저가 스크랩 한 게시물들 : 스크랩 한 게시물들에서 스크랩 한 사람들 목록에서 유저를 제외시킨다.
  user.scraps.forEach(async (scrapId) => {
    const scrap = await Board.findById(scrapId);
    scrap.scrapOwner = scrap.scrapOwner.filter((ownerId) => ownerId != _id);
    scrap.save();
  });

  // 유저가 좋아요 한 게시물들 : 좋아요 한 게시물들에서 좋아요 한 사람들 목록에서 유저를 제외시킨다.
  user.likes.forEach(async (likeId) => {
    const like = await Board.findById(likeId);
    like.likeOwner = like.likeOwner.filter((likeId) => likeId != _id);
    like.save();
  });

  // 유저에게 팔로우 보낸 사람들은 아직 유저를 팔로우 하고 있지 않기 때문에 별다른 작업을 하고 있을 필요가 없다.
  // 유저가 차단하고 있는 유저 또한 해당 유저에 대한 정보를 가지고 있지 않기 때문에 별다른 작업을 하고 있을 필요가 없다.
  // followUsers가 자신을 팔로우 하고 있는 사람들이고, followingUsers가 자신이 팔로우 하고 있는 사람들이다. 헷갈리지 말자...

  // 유저가 팔로우 하고 있는 사람들 : 각자 자신을 팔로우 하고 있는 사람들의 목록에서 유저를 제외시킨다.
  user.followUsers.forEach(async (followId) => {
    const follower = await User.findById(followId);
    follower.followingUsers = follower.followingUsers.filter(
      (userId) => userId != _id
    );
    follower.save();
  });

  // 유저가 팔로우 하고 있는 사람들 : 각자 자신이 팔로우 하고 있는 사람들의 목록에서 유저를 제외시킨다.
  user.followingUsers.forEach(async (followingId) => {
    const following = await User.findById(followingId);
    following.followUsers = following.followUsers.filter(
      (userId) => userId != _id
    );
    following.save();
  });

  // 유저가 작성한 게시물들 처리는 컨트롤러에서 안 해도 될 것 같음. 그냥 view에서 검사하여 if문을 활용해 진행하자

  await User.findByIdAndDelete(_id);
  req.session.destroy();

  return res.status(200).redirect("/");
};

/* ✅ 1차 수정 완료 */
export const userScrap = async (req, res) => {
  const {
    params: { id }
  } = req;
  const scraps = [];
  const user = await User.findById(id).populate("scraps");

  // 중요 포인트 //
  for (const scrap of user.scraps) {
    const sorted = await Board.findById(scrap._id)
      .populate("owner")
      .populate("likeOwner");
    scraps.push(sorted);
  }

  return res.status(200).render("scraps", { boards: scraps });
};

/* ✅ 1차 수정 완료 */
export const userBlock = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;

  const user = await User.findById(_id);
  const blockUser = await User.findById(id);

  if (user.blockUsers.includes(blockUser._id)) {
    user.blockUsers = user.blockUsers.filter(
      (blockedId) => blockedId != blockUser._id
    );
  } else {
    user.blockUsers.push(blockUser._id);
  }

  user.save();
  req.session.user = user;

  return res.status(200).redirect(req.headers.referer);
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
