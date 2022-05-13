const followingModalBtn = document.querySelectorAll(
  ".profile__box--info--text--number"
)[2];
const followingModalCloseBtn = document.querySelector(
  ".followingModal.modal__content--close"
);

const clickFollowingModalBtn = (event) => {
  const followingModalObj = document.querySelector(".followingModal.modal");
  followingModalObj.style.display = "block";
};

const clickFollowingModalClostBtn = (event) => {
  const followingModalObj = document.querySelector(".followingModal.modal");
  followingModalObj.style.display = "none";
};

followingModalBtn.addEventListener("click", clickFollowingModalBtn);
followingModalCloseBtn.addEventListener("click", clickFollowingModalClostBtn);
