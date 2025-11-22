
// Hàm lấy danh sách người dùng từ localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("log_username").value.trim();
  const password = document.getElementById("log_password").value;

  // Lấy danh sách users
  const users = getUsers();

  // Kiểm tra user tồn tại + đúng mật khẩu
  const user = users.find(
    u => (u.fullname === username || u.email === username) && u.password === password
  );

  if (!user) {
    alert("Sai tài khoản hoặc mật khẩu!");
    return;
  }

  // Lưu trạng thái đăng nhập
  localStorage.setItem("currentUser", JSON.stringify(user));

  alert("Đăng nhập thành công!");
  window.location.href = "index.html"; // Trang sau khi login
});
