document.addEventListener('DOMContentLoaded', function(){
	// Helper: show toast notification in bottom-right
	function showToast(text, duration = 3000){
		let container = document.querySelector('.toast-container');
		if(!container){
			container = document.createElement('div');
			container.className = 'toast-container';
			document.body.appendChild(container);
		}

		const toast = document.createElement('div');
		toast.className = 'toast';
		toast.textContent = text;
		container.appendChild(toast);

		// auto remove after duration
		const hideTimeout = setTimeout(()=>{
			toast.classList.add('hide');
		}, duration - 220);

		// remove from DOM after animation
		toast.addEventListener('animationend', (e)=>{
			if(toast.classList.contains('hide')){
				toast.remove();
			}
		});
	}

	// Add click handlers to all add-to-cart buttons
	const buttons = document.querySelectorAll('.add-to-cart');
	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			const name = btn.dataset.name || btn.closest('.product-card')?.querySelector('.product-title')?.textContent || 'sản phẩm';
			showToast(`Đã thêm ${name} vào giỏ hàng`);
		});
	});
});
