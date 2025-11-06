document.addEventListener('DOMContentLoaded', function(){
	// Add click handlers to all add-to-cart buttons
	const buttons = document.querySelectorAll('.add-to-cart');
	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			const name = btn.dataset.name || btn.closest('.product-card')?.querySelector('.product-title')?.textContent || 'sản phẩm';
			alert(`Đã thêm ${name} vào giỏ hàng`);
		});
	});
});
