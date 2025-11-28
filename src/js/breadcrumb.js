document.addEventListener("DOMContentLoaded", function () {
  const breadcrumb = document.getElementById("breadcrumb");
  if (!breadcrumb) return;

  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get("category");
  const productId = searchParams.get("id"); // nếu muốn dùng cho product-detail.html

  // Lấy tên file hiện tại
  const filename = window.location.pathname.split("/").pop().toLowerCase();

  // Khởi tạo HTML breadcrumb với Trang chủ
  let html = `<a href="index.html">Trang chủ</a>`;

  // === PHẦN LOGIC CÁC TRANG ===

  // Trang products.html
  if (filename === "products.html") {
    html += ` <span>/</span> <a href="products.html">Sản phẩm</a>`;

    if (category) {
      const catMap = {
        bedroom: "Phòng ngủ",
        livingroom: "Phòng khách",
        diningroom: "Phòng ăn",
        office: "Phòng làm việc",
      };
      html += ` <span>/</span> <span>${catMap[category] || category}</span>`;
    }
  }

  // Trang product-detail.html
  else if (filename === "product-detail.html") {
    html += ` <span>/</span> <a href="products.html">Sản phẩm</a>`;
    if (category) {
      const catMap = {
        bedroom: "Phòng ngủ",
        livingroom: "Phòng khách",
        diningroom: "Phòng ăn",
        office: "Phòng làm việc",
      };
      html += ` <span>/</span> <a href="products.html?category=${category}">${catMap[category] || category}</a>`;
    }
    html += ` <span>/</span> <span>Chi tiết sản phẩm</span>`;
  }

  // Trang cart.html
  else if (filename === "cart.html") {
    html += ` <span>/</span> <span>Giỏ hàng</span>`;
  }

  // Trang about.html
  else if (filename === "about.html") {
    html += ` <span>/</span> <span>Về Zhome</span>`;
  }

  // Homepage
  else if (filename === "" || filename === "index.html") {
    breadcrumb.style.display = "none";
    return; // không cần hiển thị breadcrumb
  }

  // === GẮN VÀO DOM ===
  breadcrumb.innerHTML = html;
});
