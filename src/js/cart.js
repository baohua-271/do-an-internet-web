document.addEventListener('DOMContentLoaded', () => {
	const cartList = document.querySelector('.cart-list');
	const totalEl = document.querySelector('.total');
	const STORAGE_KEY = 'cart';

	function parsePrice(text) {
		if (!text) return 0;
		const digits = text.replace(/[^\d]/g, '');
		return parseInt(digits || '0', 10);
	}

	function formatPrice(num) {
		if (!num) return '0₫';
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
	}

	function getStoredCart() {
		if (window.CartAPI && typeof window.CartAPI.getCart === 'function') {
			return window.CartAPI.getCart();
		}
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		} catch (e) {
			return [];
		}
	}

	function generateId() {
		return 'id_' + Math.random().toString(36).slice(2, 10);
	}

	function updateTotal() {
		let total = 0;
		const items = document.querySelectorAll('.cart-items');
		items.forEach(item => {
			const priceEl = item.querySelector('.item-price span');
			const qtyEl = item.querySelector('.quantity');
			const price = parsePrice(priceEl ? priceEl.textContent : '0');
			const qty = parseInt(qtyEl ? qtyEl.textContent : '0', 10) || 0;
			total += price * qty;
		});
		if (totalEl) totalEl.textContent = `TỔNG TIỀN: ${formatPrice(total)}`;
	}



	function createItemElement(item) {
		const li = document.createElement('li');
		li.className = 'cart-items';
		li.dataset.id = item.id;

		li.innerHTML = `
			<img class="item-img" src="${item.img}" width="150px" height="auto">
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
                	<img src="images/image.png" width="20" alt="Remove">

                </button>
			</div>
		`;

		return li;
	}

	function renderCart(items) {
		if (!cartList) return;
		cartList.innerHTML = '';
		items.forEach(it => cartList.appendChild(createItemElement(it)));
		// bind events
		document.querySelectorAll('.cart-items').forEach(bindItem);
		updateTotal();
	}

	function updateItemQty(id, qty) {
		if (window.CartAPI && typeof window.CartAPI.updateQty === 'function') {
			window.CartAPI.updateQty(id, qty);
			return; // CartAPI will dispatch cartUpdated which re-renders
		}
		const items = getStoredCart();
		const idx = items.findIndex(i => i.id === id);
		if (idx === -1) return;
		if (qty <= 0) {
			items.splice(idx, 1);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
			const el = document.querySelector(`.cart-items[data-id="${id}"]`);
			if (el) el.remove();
		} else {
			items[idx].qty = qty;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
			const elQty = document.querySelector(`.cart-items[data-id="${id}"] .quantity`);
			if (elQty) elQty.textContent = qty;
		}
		updateTotal();
	}

	function removeItem(id) {
		if (window.CartAPI && typeof window.CartAPI.removeItem === 'function') {
			window.CartAPI.removeItem(id);
			return;
		}
		const items = getStoredCart().filter(i => i.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		const el = document.querySelector(`.cart-items[data-id="${id}"]`);
		if (el) el.remove();
		updateTotal();
	}

	function bindItem(item) {
		const qtyBtns = item.querySelectorAll('.qty-btn');
		const minusBtn = qtyBtns[0];
		const plusBtn = qtyBtns[1];
		const qtyEl = item.querySelector('.quantity');
		const removeBtn = item.querySelector('.remove-btn');
		const id = item.dataset.id;

		if (minusBtn) {
			minusBtn.addEventListener('click', () => {
				let q = parseInt(qtyEl.textContent || '0', 10) || 0;
				q = q - 1;
				updateItemQty(id, q);
			});
		}

		if (plusBtn) {
			plusBtn.addEventListener('click', () => {
				let q = parseInt(qtyEl.textContent || '0', 10) || 0;
				q = q + 1;
				updateItemQty(id, q);
			});
		}

		if (removeBtn) {
			removeBtn.addEventListener('click', () => {
				removeItem(id);
			});
		}
	}

	// Initialize: load from storage (CartAPI) and render. If no stored data, start empty.
	const stored = getStoredCart();
	if (stored.length > 0) {
		renderCart(stored);
	} else {
		if (cartList) cartList.innerHTML = '';
		updateTotal();
	}

	// Re-render when CartAPI dispatches updates
	window.addEventListener('cartUpdated', (e) => {
		const cart = e?.detail?.cart || getStoredCart();
		renderCart(cart);
	});

	// Clear all button
	const clearBtn = document.querySelector('.clear-cart-btn');
	if (clearBtn) {
		clearBtn.addEventListener('click', () => {
			if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
			if (window.CartAPI && typeof window.CartAPI.clearCart === 'function') {
				window.CartAPI.clearCart();
			} else {
				localStorage.removeItem(STORAGE_KEY);
				if (cartList) cartList.innerHTML = '';
				updateTotal();
			}
		});
	}
});



// Payment
const ThanhToanButton = document.getElementById("checkout-btn")

const PaymentImage = document.getElementById("payment")

ThanhToanButton.addEventListener('click', function() {
  
  if (PaymentImage.style.display === 'none') {
    
    PaymentImage.style.display = 'block';
  } else {
    
    PaymentImage.style.display = 'none';
  }
});
