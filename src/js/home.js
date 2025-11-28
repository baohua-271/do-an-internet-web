    

  // Hiệu ứng banner tự động đổi ảnh + nút mũi tên
  document.addEventListener("DOMContentLoaded", function() {
  const slides = document.querySelectorAll(".slides img"); // lấy tất cả ảnh trong .slides
  const prevBtn = document.querySelector(".prev"); // nút mũi tên trái
  const nextBtn = document.querySelector(".next"); // nút mũi tên phải
  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlide; // lưu timer tự động

  // Hàm hiển thị ảnh theo index
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  // Hàm đổi sang ảnh kế tiếp
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }

  // Hàm quay lại ảnh trước
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
  }

  // Tự động chuyển ảnh sau mỗi 4 giây
  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 6000);
  }

  // Dừng khi người dùng click (để tránh nhảy ảnh đột ngột)
  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  // Gắn sự kiện click cho 2 nút
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  // Khởi động ban đầu
  showSlide(currentIndex);
  startAutoSlide();
});


// Khi trang load xong, bắt đầu fetch dữ liệu
document.addEventListener("DOMContentLoaded", () => {

  // Đọc file JSON (danh sách sản phẩm)
  fetch("data/products.json")
    .then(response => response.json())
    .then(products => {
      // Lọc theo từng loại
      const newProducts = products.filter(p => p.isNew);
      const saleProducts = products.filter(p => p.isSale);
      const bestProducts = products.filter(p => p.isBestSeller);

      // Render từng loại ra đúng khu vực HTML
      renderProducts(newProducts, "new-products");
      renderProducts(saleProducts, "sale-products");
      renderProducts(bestProducts, "best-products");
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
});

// Hàm render sản phẩm ra HTML
function renderProducts(list, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Xóa nội dung cũ nếu có

  list.forEach(p => {
    const item = document.createElement("div");
    item.classList.add("product");

    // Tạo HTML hiển thị sản phẩm
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price.toLocaleString()}đ</p>
      <button class="detail-btn">Xem chi tiết</button>
    `;

    // Khi click -> sang trang chi tiết
    item.querySelector(".detail-btn").addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });

    container.appendChild(item);
  });
}


// ======================
// GỢI Ý SẢN PHẨM (CHUYỂN ĐỘNG MƯỢT LIÊN TỤC NHƯ BÁNH XE)
// ======================
document.addEventListener("DOMContentLoaded", async () => {
  const track = document.getElementById("suggestion-track");
  const section = document.querySelector(".suggestion-section");

  try {
    const response = await fetch("data/products.json");
    const products = await response.json();

    // Lấy 10 sản phẩm đầu tiên
    const suggested = products.slice(0, 10);

    // Tạo HTML cho 10 sản phẩm
    suggested.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}đ</p>
      `;
      track.appendChild(card);
    });

    // Nhân đôi danh sách sản phẩm để tạo hiệu ứng xoay vòng mượt
    suggested.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}₫</p>
      `;
      track.appendChild(card);
    });

    // Khi hover thì dừng animation
    section.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });

    // Khi rời chuột thì tiếp tục
    section.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });

  } catch (error) {
    console.error("Lỗi tải gợi ý sản phẩm:", error);
  }
});









