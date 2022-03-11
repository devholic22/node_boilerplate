const btns = document.querySelectorAll(".board__info--btns--btn span");
const spans = document.querySelectorAll(".modal-close");

const btnModalClick = (event) => {
  const modalObj =
    event.target.parentElement.parentElement.querySelector(".like-modal");
  modalObj.style.display = "block";
};
const spanModalClick = (event) => {
  const modalObj = event.target.parentElement.parentElement;
  modalObj.style.display = "none";
};
if (btns && spans) {
  btns.forEach((btn) => btn.addEventListener("click", btnModalClick));
  spans.forEach((span) => span.addEventListener("click", spanModalClick));
}
