import Board from "../models/Board";

export const getUpload = (req, res) => {
  return res.render("upload");
};

export const postUpload = async (req, res) => {
  const { title, content } = req.body;
  const board = await Board.create({
    title,
    content
  });
  console.log(board);
  return res.redirect("/");
};
