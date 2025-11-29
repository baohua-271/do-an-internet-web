// Hiệu ứng đổi màu thanh nav khi scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Tính năng hiển thị tên người dùng khi đã đăng nhập
document.addEventListener("DOMContentLoaded", () => {
  const loginArea = document.querySelector(".login");
  let user = localStorage.getItem("currentUser");

  if (user && loginArea) {
    user = JSON.parse(user);

    // Hiển thị tên người dùng sau khi đăng nhập
    loginArea.innerHTML = `
            <i class="fa fa-user"></i>
            <span> Xin chào, <strong>${user.fullname}</strong> </span>
            | <a href="#" id="logoutBtn" class="logout-btn" style="color:red;">Đăng xuất</a>
        `;

    // Xử lý logout
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload(); // load lại nav tất cả trang
    });
  }
});

// MỞ MENU HAMBURGER
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("show-menu");
});
