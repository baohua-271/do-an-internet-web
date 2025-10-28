    // Hiệu ứng đổi màu thanh nav khi scroll
    window.addEventListener("scroll", function() {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
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
    autoSlide = setInterval(nextSlide, 4000);
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

