import multer from "multer";

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
  if (res.locals.loggedIn === false) {
    return res.redirect("/");
  }
  next();
};

export const avatarUpload = multer({ dest: "uploads/avatars" });
