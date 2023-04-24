const iconToggle = document.querySelector("#icon-toggle");
const sideBar = document.querySelector(".side-bar");
const closeIcon = document.querySelector("#close-icon");

iconToggle.addEventListener("click", (e) => {
    e.preventDefault;
    sideBar.classList.add("side-bar-show");
});

closeIcon.addEventListener("click", (e) => {
    e.preventDefault;
    sideBar.classList.remove("side-bar-show");
});
