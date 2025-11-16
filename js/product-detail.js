// 📦 Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Lấy id từ URL

  // Nếu không có id thì quay lại trang chủ
  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  // 📁 Đọc dữ liệu sản phẩm từ file JSON
  fetch("data/products.json")
    .then(response => response.json())
    .then(products => {
      // Tìm sản phẩm theo ID
      const product = products.find(p => p.id === productId);
      if (!product) {
        document.getElementById("product-detail-container").innerHTML = "<p>Sản phẩm không tồn tại.</p>";
        return;
      }

      // 🖼 Render chi tiết sản phẩm
      displayProductDetail(product);
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
});

// 🎨 Hàm render thông tin chi tiết sản phẩm
function displayProductDetail(product) {
  const container = document.getElementById("product-detail-container");

  container.innerHTML = `
    <div class="product-detail">
      <div class="image-section">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="info-section">
        <h2>${product.name}</h2>
        <p class="price">${product.price.toLocaleString()}đ</p>
        <p class="desc">${product.description}</p>

        <p><strong>Danh mục:</strong> ${product.category}</p>

        <button class="add-to-cart-btn">🛒 Thêm vào giỏ hàng</button>
      </div>
    </div>
  `;
}
