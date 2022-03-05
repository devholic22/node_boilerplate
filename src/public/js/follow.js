const followSpan = document.querySelector(".user-follow__number");
const followingSpan = document.querySelector(".user-following__number");
const spans = document.querySelectorAll(".modal-close");

const showFollow = (event) => {
  const modalObj =
    event.target.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".follow-modal"
    );
  modalObj.style.display = "block";
};

const showFollowing = (event) => {
  const modalObj =
    event.target.parentElement.parentElement.parentElement.parentElement.querySelector(
      ".following-modal"
    );
  modalObj.style.display = "block";
};
const spanModalClick = (event) => {
  const modalObj = event.target.parentElement.parentElement;
  modalObj.style.display = "none";
};
followSpan.addEventListener("click", showFollow);
followingSpan.addEventListener("click", showFollowing);

spans.forEach((span) => span.addEventListener("click", spanModalClick));
