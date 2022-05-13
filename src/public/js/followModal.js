const followModalBtn = document.querySelectorAll(
  ".profile__box--info--text--number"
)[1];
const followModalCloseBtn = document.querySelector(
  ".followModal.modal__content--close"
);

const clickFollowModalBtn = (event) => {
  const followModalObj = document.querySelector(".followModal.modal");
  followModalObj.style.display = "block";
};

const clickFollowModalClostBtn = (event) => {
  const followModalObj = document.querySelector(".followModal.modal");
  followModalObj.style.display = "none";
};

followModalBtn.addEventListener("click", clickFollowModalBtn);
followModalCloseBtn.addEventListener("click", clickFollowModalClostBtn);
