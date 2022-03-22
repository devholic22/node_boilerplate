const followSpan = document.querySelector(
  ".profile__box--info--text div span:nth-child(2)"
);
const followingSpan = document.querySelector(
  ".profile__box--info--text--number:nth-child(3)"
);
const spans = document.querySelectorAll(".modal__content--close");

const showFollow = (event) => {
  const modal = document.querySelectorAll(".modal")[0];
  modal.style.display = "block";
};

const showFollowing = (event) => {
  const modal = document.querySelectorAll(".modal")[1];
  modal.style.display = "block";
};

const spanModalClick = (event) => {
  const modalObj = event.target.parentElement.parentElement.parentElement;
  modalObj.style.display = "none";
};

followSpan.addEventListener("click", showFollow);
followingSpan.addEventListener("click", showFollowing);

spans.forEach((span) => span.addEventListener("click", spanModalClick));
