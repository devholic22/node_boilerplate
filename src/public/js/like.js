const btns = document.querySelectorAll(".like-length");
const spans = document.querySelectorAll(".modal__content--close");

const btnModalClick = (event) => {
  const modalObj =
    event.target.parentElement.parentElement.querySelector(".modal");
  modalObj.style.display = "block";
};
const spanModalClick = (event) => {
  const modalObj = event.target.parentElement.parentElement.parentElement;
  modalObj.style.display = "none";
};
if (btns && spans) {
  btns.forEach((btn) => btn.addEventListener("click", btnModalClick));
  spans.forEach((span) => span.addEventListener("click", spanModalClick));
}
