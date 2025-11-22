document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const keyword = input.value.trim().toLowerCase();
    if (!keyword) return;

    try {
      // Lấy dữ liệu sản phẩm
      const res = await fetch("data/products.json");
      const products = await res.json();

      // Tìm sản phẩm theo name (chuẩn hóa chữ thường)
      const matchedByName = products.find(p =>
        p.name.toLowerCase() === keyword
      );

      if (matchedByName) {
        // Nếu tìm thấy trùng name → đi thẳng trang chi tiết
        window.location.href = `product-detail.html?id=${matchedByName.id}`;
        return;
      }

      // Tìm sản phẩm theo type
      const matchedByType = products.find(p =>
        p.type && p.type.toLowerCase() === keyword
      );

      if (matchedByType) {
        // Nếu tìm thấy trùng type → đi tới trang products.html kèm query
        window.location.href = `products.html?type=${matchedByType.type}`;
        return;
      }

      // Nếu không tìm thấy → thông báo
      alert("Không tìm thấy sản phẩm phù hợp!");
    } catch (err) {
      console.error("Lỗi tải dữ liệu sản phẩm:", err);
    }
  });
});
