// Định nghĩa các hằng số (Constants)
const TITLE_MAP = {
  bedroom: "Sản phẩm Phòng ngủ",
  livingroom: "Sản phẩm Phòng khách",
  diningroom: "Sản phẩm Phòng ăn",
  office: "Sản phẩm Phòng làm việc",
};

const BANNER_IMAGES = {
  bedroom: "images/banners/bedroom-banner.jpg",
  livingroom: "images/banners/livingroom-banner.jpg",
  diningroom: "images/banners/diningroom-banner.jpg",
  office: "images/banners/office-banner.jpg",
  default: "images/banners/products-banner.jpg",
};

const BANNER_TITLES = {
  bedroom: "Nội thất phòng ngủ",
  livingroom: "Nội thất phòng khách",
  diningroom: "Nội thất phòng ăn",
  office: "Nội thất phòng làm việc",
  default: "Sản phẩm Zhome",
};

// Hàm hiển thị sản phẩm
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = ""; // Xóa nội dung cũ

  if (!list || list.length === 0) {
    container.innerHTML = "<p>Không có sản phẩm nào phù hợp.</p>";
    return;
  }

  list.forEach((p) => {
    const item = document.createElement("div");
    item.classList.add("product");
    item.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.price.toLocaleString()}đ</p>
            <button class="detail-btn">Xem chi tiết</button>
        `;

    item.querySelector(".detail-btn").addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });

    container.appendChild(item);
  });
}

// Hàm lấy và Lọc Dữ Liệu
async function getFilteredProducts() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const type = params.get("type");

  const res = await fetch("data/products.json");
  let products = await res.json();

  // Lọc theo category
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  // Lọc theo type
  if (type) {
    products = products.filter(
      (p) => p.type.toLowerCase() === type.toLowerCase()
    );
  }

  return { filteredProducts: products, category, type };
}

// Hàm Xử Lý Banner và Tiêu Đề
function updatePageInfo(category, type) {
  // Cập nhật Tiêu đề trang
  const titleEl = document.getElementById("category-title");
  if (type) {
    titleEl.textContent = `Sản phẩm loại "${type}"`;
  } else if (category) {
    titleEl.textContent = TITLE_MAP[category] || "Tất cả sản phẩm";
  } else {
    titleEl.textContent = "Tất cả sản phẩm";
  }

  // Cập nhật Banner
  const banner = document.getElementById("page-banner");
  const activeCategory =
    category && BANNER_IMAGES[category] ? category : "default";

  banner.style.backgroundImage = `url(${BANNER_IMAGES[activeCategory]})`;
  banner.innerHTML = `<h2 class="banner-title">${BANNER_TITLES[activeCategory]}</h2>`;
  banner.style.display = "block";
}

// Khối Khởi Tạo Chính
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Lấy và lọc sản phẩm ban đầu
    const { filteredProducts, category, type } = await getFilteredProducts();

    // Cập nhật thông tin trang
    updatePageInfo(category, type);

    // Hiển thị sản phẩm
    renderProducts(filteredProducts);
  } catch (err) {
    console.error("Lỗi khởi tạo trang sản phẩm:", err);
    document.getElementById("category-title").textContent = "Lỗi tải dữ liệu";
  }
});

// Chức năng Sort
document.getElementById("sort").addEventListener("change", async function () {
  const sortType = this.value;

  try {
    // Lấy lại danh sách sản phẩm đã được lọc (dựa trên URL)
    const { filteredProducts: products } = await getFilteredProducts();

    // Sao chép và sắp xếp
    let sorted = [...products];

    if (sortType === "priceAsc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "priceDesc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    // Hiển thị lại
    renderProducts(sorted);
  } catch (err) {
    console.error("Lỗi sắp xếp sản phẩm:", err);
  }
});
