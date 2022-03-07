const content = document.querySelector(".show-contents");
const form = document.querySelector(".show-contents__comment-form");
const text = document.querySelector(".form-text");
const btn = document.querySelector(".form-button");

const handleSubmit = (event) => {
  event.preventDefault();
  const value = text.value;
  const boardId = content.dataset.id;
  fetch(`/api/boards/${boardId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }, // We send "json" string!
    body: JSON.stringify({ value }) // only string
  });
  text.value = "";
};

form.addEventListener("submit", handleSubmit);
