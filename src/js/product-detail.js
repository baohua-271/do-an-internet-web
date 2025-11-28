// Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Lấy id từ URL

  // Nếu không có id thì quay lại trang chủ
  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  // Đọc dữ liệu sản phẩm từ file JSON
  fetch("data/products.json")
    .then((response) => response.json())
    .then((products) => {
      // Tìm sản phẩm theo ID
      const product = products.find((p) => p.id === productId);
      if (!product) {
        document.getElementById("product-detail-container").innerHTML =
          "<p>Sản phẩm không tồn tại.</p>";
        return;
      }

      //Render chi tiết sản phẩm
      displayProductDetail(product);
    })
    .catch((error) => console.error("Lỗi tải dữ liệu:", error));
});

// Hàm render thông tin chi tiết sản phẩm
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

  //===== THÊM SẢN PHẨM VÀO GIỎ HÀNG =====
  const btn = container.querySelector(".add-to-cart-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      const item = {
        id: product.id?.toString() || product.name + "_" + Date.now(),
        name: product.name,
        price: product.price,
        img: product.image,
        qty: 1,
      };
      if (window.CartAPI && typeof window.CartAPI.addToCart === "function") {
        window.CartAPI.addToCart(item);
        showToast("Đã thêm vào giỏ hàng");
      } else {
        alert("Không thể thêm vào giỏ hàng (CartAPI không sẵn sàng)");
      }
    });
  }
}

// Simple toast notification
function showToast(message) {
  let t = document.createElement("div");
  t.textContent = message;
  t.style.position = "fixed";
  t.style.right = "20px";
  t.style.bottom = "20px";
  t.style.padding = "10px 14px";
  t.style.background = "rgba(0,0,0,0.8)";
  t.style.color = "#fff";
  t.style.borderRadius = "6px";
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
  }, 1500);
  setTimeout(() => {
    t.remove();
  }, 2000);
}

//===== HIỂN THỊ CHI TIẾT PHẨM KHI TÌM KIẾM =====

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // id sản phẩm từ URL
  const detailContainer = document.getElementById("product-detail");

  if (!id || !detailContainer) return;

  try {
    const res = await fetch("data/products.json");
    const products = await res.json();

    const product = products.find((p) => p.id === parseInt(id));
    if (!product) {
      detailContainer.innerHTML = "<p>Sản phẩm không tồn tại.</p>";
      return;
    }

    // Hiển thị chi tiết sản phẩm
    detailContainer.innerHTML = `
      <div class="product-detail-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="detail-info">
          <h2>${product.name}</h2>
          <p class="price">${product.price.toLocaleString()}₫</p>
          <p class="description">${product.description}</p>
          ${product.isNew ? '<span class="badge new">Mới</span>' : ""}
          ${product.isSale ? '<span class="badge sale">Sale</span>' : ""}
          ${
            product.isBestSeller
              ? '<span class="badge best">Bán chạy</span>'
              : ""
          }
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
  }
});
