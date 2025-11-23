document.addEventListener("DOMContentLoaded", () => {
  // Lấy tham số từ URL, ví dụ ?category=bedroom: để biết người dùng muốn xem danh mục nào
  const params = new URLSearchParams(window.location.search); // đọc URL
  const category = params.get("category"); // lấy chuỗi: giá trị của category trong data

  // Đọc dữ liệu sản phẩm
  fetch("data/products.json") // gửi yêu cầu HTTP GET tới file data
    .then(res => res.json()) // chuyển đổi dữ liệu đã lấy thành công
    .then(products => {
      const filtered = category
        ? products.filter(p => p.category === category)
        : products;

      // Cập nhật tiêu đề trang
      const titleMap = { 
        // bảng ánh xạ
        bedroom: "Sản phẩm Phòng ngủ",
        livingroom: "Sản phẩm Phòng khách",
        diningroom: "Sản phẩm Phòng ăn",
        office: "Sản phẩm Phòng làm việc",
      };
      document.getElementById("category-title").textContent =
        titleMap[category] || "Tất cả sản phẩm";

      renderProducts(filtered); // tạo và hiển thị giao diện HTML cho các sản phẩm đã lọc
    })
    .catch(err => console.error("Lỗi tải dữ liệu:", err));
});

function renderProducts(list) {
  const container = document.getElementById("product-list"); // ánh xạ tới nơi có id: product-list trong html để bỏ dữ liệu vào
  container.innerHTML = "";
  
  if (list.length === 0) {
	// nếu không có sản phẩm nào trong chủ đề
    container.innerHTML = "<p>Không có sản phẩm nào trong danh mục này.</p>";
    return;
  }

  list.forEach(p => {
	// nếu có sản phẩm
    const item = document.createElement("div"); // tạo div cho từng sản phẩm
    item.classList.add("product");
	// thiết lập để ứng dụng css
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price.toLocaleString()}đ</p>
      <button class="detail-btn">Xem chi tiết</button>
    `;
	// Khi ấn vào "Xem chi tiết" sẽ đẩy đến trang product-detail.html
    item.querySelector(".detail-btn").addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });

    container.appendChild(item);
  });
}



// Lấy category từ URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// Định nghĩa ảnh banner cho từng category
const bannerImages = {
  bedroom: "images/banners/bedroom-banner.jpg",
  livingroom: "images/banners/livingroom-banner.jpg",
  diningroom: "images/banners/diningroom-banner.jpg",
  office: "images/banners/office-banner.jpg",
  default: "images/banners/products-banner.jpg" // ảnh mặc định khi không chọn category
};

// Định nghĩa tiêu đề cho từng category
const bannerTitles = {
  bedroom: "Nội thất phòng ngủ",
  livingroom: "Nội thất phòng khách",
  diningroom: "Nội thất phòng ăn",
  office: "Nội thất phòng làm việc",
  default: "Sản phẩm Zhome" // tiêu đề mặc định
};

// Lấy phần tử banner
const banner = document.getElementById("page-banner");

// Xác định category hợp lệ hay dùng default
const activeCategory = category && bannerImages[category] ? category : "default";

// Gán ảnh và tiêu đề
banner.style.backgroundImage = `url(${bannerImages[activeCategory]})`;
banner.innerHTML = `<h2 class="banner-title">${bannerTitles[activeCategory]}</h2>`;
banner.style.display = "block";



//===== HIỂN THỊ SẢN PHẨM KHI TÌM KIẾM =====

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category"); // filter theo category
  const type = params.get("type");         // filter theo type

  try {
    const res = await fetch("data/products.json");
    const products = await res.json();

    let filtered = products;

    // Lọc theo category
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Lọc theo type
    if (type) {
      filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }


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

    renderProducts(filtered);

  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
  }
});

// Hàm render sản phẩm
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
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price.toLocaleString()}₫</p>
      <button class="detail-btn">Xem chi tiết</button>
    `;

    item.querySelector(".detail-btn").addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });

    container.appendChild(item);
  });
}

//CHỨC NĂNG SORT
document.getElementById("sort").addEventListener("change", async function () {
  const sortType = this.value;

  // Lấy lại tham số URL (category & type)
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const type = params.get("type");

  // Load dữ liệu
  const res = await fetch("data/products.json");
  let products = await res.json();

  // Lọc theo category
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // Lọc theo type
  if (type) {
    products = products.filter(p => p.type.toLowerCase() === type.toLowerCase());
  }

  // ===== SORT =====
  let sorted = [...products];

  if (sortType === "priceAsc") {
    sorted.sort((a, b) => a.price - b.price);
  }

  if (sortType === "priceDesc") {
    sorted.sort((a, b) => b.price - a.price);
  }

  // sortType = default → giữ nguyên products

  // Hiển thị lại
  renderProducts(sorted);
});
