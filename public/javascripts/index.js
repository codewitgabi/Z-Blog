const searchCon = document.getElementById("search");
const search = document.querySelectorAll(".search");
const searchClose = document.querySelector("#search .bi-x");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const authLinks = document.getElementById("auth-links");


search.forEach((s) => {
  s.addEventListener("click", () => {
    searchCon.style.opacity = 1;
    searchCon.style.transform = "scale(1)";
  })
})

searchClose.addEventListener("click", () => {
  searchCon.style.opacity = 0;
  searchCon.style.transform = "scale(0)";
})

openMenu.addEventListener("click", () => {
  authLinks.style.right = "0";
})

closeMenu.addEventListener("click", () => {
  authLinks.style.right = "-250px";
})

const file = document.getElementById("image");
const img = document.getElementById("author-image-display");

file?.addEventListener("change", (e) => {
  const f = e.target.files[0]
  const reader = new FileReader();
  reader.onload = function () {
    img.src = reader.result
  }

  reader.readAsDataURL(f)
})
