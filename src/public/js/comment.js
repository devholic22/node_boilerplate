const content = document.querySelector(".show-contents");
const form = document.querySelector(".show-contents__comment-form");
const text = document.querySelector(".form-text");
const btn = document.querySelector(".form-button");

const smallLink = document.querySelectorAll(".small-comment");
const smallForm = document.querySelectorAll(".small-comment__form");

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
    ".small-comment__form"
  );
  form.style.display = "";
  form.addEventListener("submit", handleSmallSubmit);

  const deleteBtn = event.target.parentElement.parentElement.querySelector(
    ".small-comment__delete"
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
  const showBtn = form.parentElement.querySelector(".small-comment");
  console.log(showBtn);
  showBtn.style.display = "";
};
