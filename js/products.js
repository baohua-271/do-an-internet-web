// Biến toàn cục để lưu trữ sản phẩm đã được lọc
let currentProducts = [];

// Định nghĩa hàm renderProducts (đã có, nhưng được đưa lên đầu)
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = "<p>Không có sản phẩm nào phù hợp.</p>";
    return;
  }

  list.forEach(p => {
    const item = document.createElement("div");
    item.classList.add("product");
    item.innerHTML = `
      <a href="product-detail.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}">
      </a>
      <h3>${p.name}</h3>
      <p class="price">${p.price.toLocaleString()}₫</p>
      <button class="detail-btn" data-id="${p.id}">Xem chi tiết</button>
    `;
    // Sử dụng data-id và gán sự kiện cho nút Xem chi tiết
    item.querySelector(".detail-btn").addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      window.location.href = `product-detail.html?id=${productId}`;
    });

    container.appendChild(item);
  });
}

// Hàm sắp xếp sản phẩm
function sortProducts(sortType) {
  let sortedList = [...currentProducts]; // Tạo bản sao để tránh thay đổi mảng gốc

  switch (sortType) {
    case "price-asc":
      sortedList.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedList.sort((a, b) => b.price - a.price);
      break;
    case "default":
      // Nếu là "Mặc định", không làm gì hoặc sắp xếp theo ID/tên ban đầu (tùy thuộc vào yêu cầu)
      // Hiện tại, ta sẽ chỉ render lại danh sách đã lọc ban đầu
      break;
  }

  renderProducts(sortedList);
}

// Hàm chính xử lý tải, lọc và thiết lập banner
async function initializeProductsPage() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const type = params.get("type");

  // --- 1. Thiết lập Banner ---
  const bannerImages = {
    bedroom: "images/banners/bedroom-banner.jpg",
    livingroom: "images/banners/livingroom-banner.jpg",
    diningroom: "images/banners/diningroom-banner.jpg",
    office: "images/banners/office-banner.jpg",
    default: "images/banners/products-banner.jpg" 
  };
  const bannerTitles = {
    bedroom: "Nội thất phòng ngủ",
    livingroom: "Nội thất phòng khách",
    diningroom: "Nội thất phòng ăn",
    office: "Nội thất phòng làm việc",
    default: "Sản phẩm Zhome"
  };
  const banner = document.getElementById("page-banner");
  const activeCategory = category && bannerImages[category] ? category : "default";
  banner.style.backgroundImage = `url(${bannerImages[activeCategory]})`;
  banner.innerHTML = `<h2 class="banner-title">${bannerTitles[activeCategory]}</h2>`;
  banner.style.display = "block";

  // --- 2. Tải và Lọc Sản phẩm ---
  try {
    const res = await fetch("data/products.json");
    const products = await res.json();

    let filtered = products;

    // Lọc theo category
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    // Lọc theo type (cho chức năng tìm kiếm)
    if (type) {
      filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }

    // Lưu danh sách đã lọc vào biến toàn cục
    currentProducts = filtered; 

    // Cập nhật tiêu đề trang
    const titleEl = document.getElementById("category-title");
    if (type) {
      titleEl.textContent = `Sản phẩm loại "${type}"`;
    } else if (category) {
      const titleMap = {
        bedroom: "Sản phẩm Phòng ngủ",
        livingroom: "Sản phẩm Phòng khách",
        diningroom: "Sản phẩm Phòng ăn",
        office: "Sản phẩm Phòng làm việc"
      };
      titleEl.textContent = titleMap[category] || "Tất cả sản phẩm";
    } else {
      titleEl.textContent = "Tất cả sản phẩm";
    }

    // Render sản phẩm lần đầu
    renderProducts(currentProducts);

  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    document.getElementById("product-list").innerHTML = "<p>Đã xảy ra lỗi khi tải dữ liệu sản phẩm.</p>";
  }

  // --- 3. Thêm sự kiện cho thanh Sort (mới) ---
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortProducts(e.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", initializeProductsPage);