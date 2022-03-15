const content = document.querySelector(".watch");
const form = document.querySelector(".watch__comment--form");
const text = document.querySelector(".watch__comment--input");
const btn = document.querySelector(".watch__comment--button");

const smallLink = document.querySelectorAll(".small-comment__append--title");
const smallForm = document.querySelectorAll(".small-comment__append--form");

for (const form of smallForm) {
  form.style.display = "none";
}

const handleSubmit = async (event) => {
  event.preventDefault();
  const value = text.value;
  const boardId = content.dataset.id;
  await fetch(`/api/boards/${boardId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }, // We send "json" string!
    body: JSON.stringify({ value }) // only string
  });
  text.value = "";
  window.location.reload();
};

const handleSmallSubmit = async (event) => {
  event.preventDefault();
  const smallComment = event.target.querySelector("input");
  const value = smallComment.value;
  const commentId =
    event.target.parentElement.parentElement.parentElement.dataset.id;
  await fetch(`/api/comments/${commentId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ value })
  });
  smallComment.value = "";
  window.location.reload();
};

const handleSmallClick = (event) => {
  event.preventDefault();
  const link = event.target;
  link.style.display = "none";
  const form = event.target.parentElement.parentElement.querySelector(
    ".small-comment__append--form"
  );
  form.style.display = "";
  form.addEventListener("submit", handleSmallSubmit);

  const deleteBtn = event.target.parentElement.parentElement.querySelector(
    ".small-comment__append--form span"
  );
  deleteBtn.addEventListener("click", handleSmallDeleteClick);
};
form.addEventListener("submit", handleSubmit);

for (const link of smallLink) {
  link.addEventListener("click", handleSmallClick);
}

const handleSmallDeleteClick = (event) => {
  event.preventDefault();
  const form = event.target.parentElement;
  form.style.display = "none";
  const showBtn = form.parentElement.querySelector(
    ".small-comment__append--title"
  );
  showBtn.style.display = "";
};
