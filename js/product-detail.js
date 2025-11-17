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
    .then(response => response.json())
    .then(products => {
      // Tìm sản phẩm theo ID
      const product = products.find(p => p.id === productId);
      if (!product) {
        document.getElementById("product-detail-container").innerHTML = "<p>Sản phẩm không tồn tại.</p>";
        return;
      }

      //Render chi tiết sản phẩm
      displayProductDetail(product);
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
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

  // Gắn sự kiện thêm vào giỏ hàng
  const btn = container.querySelector('.add-to-cart-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const item = {
        id: product.id?.toString() || (product.name + '_' + Date.now()),
        name: product.name,
        price: product.price,
        img: product.image,
        qty: 1,
      };
      if (window.CartAPI && typeof window.CartAPI.addToCart === 'function') {
        window.CartAPI.addToCart(item);
        showToast('Đã thêm vào giỏ hàng');
      } else {
        alert('Không thể thêm vào giỏ hàng (CartAPI không sẵn sàng)');
      }
    });
  }
}

// Simple toast notification
function showToast(message) {
  let t = document.createElement('div');
  t.textContent = message;
  t.style.position = 'fixed';
  t.style.right = '20px';
  t.style.bottom = '20px';
  t.style.padding = '10px 14px';
  t.style.background = 'rgba(0,0,0,0.8)';
  t.style.color = '#fff';
  t.style.borderRadius = '6px';
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; }, 1500);
  setTimeout(() => { t.remove(); }, 2000);
}
