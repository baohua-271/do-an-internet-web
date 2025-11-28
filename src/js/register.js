
// Lấy danh sách user từ localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Lưu danh sách user vào localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const fullname = document.getElementById("reg_fullname").value.trim();
  const email = document.getElementById("reg_email").value.trim();
  const password = document.getElementById("reg_password").value;
  const confirm = document.getElementById("reg_confirm").value;

  // Kiểm tra mật khẩu trùng khớp
  if (password !== confirm) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  const users = getUsers();

  // Kiểm tra email đã tồn tại chưa
  const emailExists = users.some(u => u.email === email);

  if (emailExists) {
    alert("Email này đã được đăng ký trước đó!");
    return;
  }

  // Tạo user mới
  const newUser = {
    fullname: fullname,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  };

  // Lưu user mới
  users.push(newUser);
  saveUsers(users);

  alert("Đăng ký thành công! Hãy tiến hành đăng nhập.");
  window.location.href = "login.html";
});
