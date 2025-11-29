/********************************************
 *  CART PAGE SCRIPT – HIỂN THỊ & CẬP NHẬT GIỎ HÀNG
 ********************************************/

document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.querySelector(".cart-list");
  const totalEl = document.querySelector(".total");
  const STORAGE_KEY = "cart";

  /** Chuyển chuỗi VNĐ → số để tính toán */
  function parsePrice(text) {
    if (!text) return 0;
    return parseInt(text.replace(/[^\d]/g, "") || "0", 10);
  }

  /** Chuyển số → định dạng VNĐ */
  function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  }

  /** Lấy giỏ hàng từ CartAPI hoặc localStorage */
  function getStoredCart() {
    if (window.CartAPI) return window.CartAPI.getCart();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  /** Tính tổng giá tiền và cập nhật ra UI */
  function updateTotal() {
    let total = 0;
    let count = 0;
    document.querySelectorAll(".cart-items").forEach((item) => {
      const price = parsePrice(
        item.querySelector(".item-price span").textContent
      );
      const qty = Number(item.querySelector(".quantity").textContent);
      count += qty;
      total += price * qty;
    });

    if (totalEl) totalEl.textContent = `TỔNG TIỀN: ${formatPrice(total)}`;

    // Gửi dữ liệu cho popup thanh toán
    updatePaymentBox(count, total);
  }

  /** Tạo HTML item sản phẩm trong danh sách */
  function createItemElement(item) {
    const li = document.createElement("li");
    li.className = "cart-items";
    li.dataset.id = item.id;

    li.innerHTML = `
      <img class="item-img" src="${item.img}" width="150">

      <div class="item-info">
        <p class="item-name">${item.name}</p>
        <p class="item-price">Giá: <span>${formatPrice(item.price)}</span></p>
      </div>

      <div class="item-control">
        <div class="quantity-control">
          <button class="qty-btn">-</button>
          <span class="quantity">${item.qty}</span>
          <button class="qty-btn">+</button>
        </div>

        <button class="remove-btn">
          <img src="images/image.png" width="20">
        </button>
      </div>
    `;
    return li;
  }

  /** Render toàn bộ giỏ hàng ra giao diện */
  function renderCart(items) {
    cartList.innerHTML = "";
    items.forEach((i) => cartList.appendChild(createItemElement(i)));
    document.querySelectorAll(".cart-items").forEach(bindItem);
    updateTotal();
  }

  /** Tăng giảm số lượng sản phẩm */
  function updateItemQty(id, qty) {
    window.CartAPI.updateQty(id, qty); // dùng API → tự trigger cartUpdated
  }

  /** Xóa sản phẩm */
  function removeItem(id) {
    window.CartAPI.removeItem(id);
  }

  /** Gắn sự kiện + / - / remove */
  function bindItem(item) {
    const id = item.dataset.id;
    const qtyEl = item.querySelector(".quantity");

    item.querySelectorAll(".qty-btn")[0].onclick = () =>
      updateItemQty(id, Number(qtyEl.textContent) - 1);

    item.querySelectorAll(".qty-btn")[1].onclick = () =>
      updateItemQty(id, Number(qtyEl.textContent) + 1);

    item.querySelector(".remove-btn").onclick = () => removeItem(id);
  }

  /** Khi có thay đổi từ CartAPI → tự cập nhật UI */
  window.addEventListener("cartUpdated", (e) => renderCart(e.detail.cart));

  renderCart(getStoredCart());

  /** CLEAR CART */
  const clearBtn = document.querySelector(".clear-cart-btn");
  if (clearBtn)
    clearBtn.onclick = () =>
      confirm("Xóa toàn bộ giỏ hàng?") && window.CartAPI.clearCart();

  /*************************************************
   * 🔥 PHẦN NÂNG CẤP – POPUP THANH TOÁN QR
   *************************************************/

  const popup = document.getElementById("payment-box");
  const checkout = document.getElementById("checkout-btn");

  checkout.addEventListener("click", () => {
    popup.classList.toggle("show");
  });

  /** Cập nhật info tổng sản phẩm & giá cho popup */
  function updatePaymentBox(totalQty, totalPrice) {
    document.getElementById("pay-qty").textContent = totalQty;
    document.getElementById("pay-total").textContent = formatPrice(totalPrice);
  }
});
