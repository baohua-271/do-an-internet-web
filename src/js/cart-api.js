(function () {
  const STORAGE_KEY = "cart";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart } }));
  }

  function findIndexById(cart, id) {
    return cart.findIndex((i) => i.id === id);
  }

  function addToCart(item) {
    const cart = getCart();
    const idx = findIndexById(cart, item.id);
    if (idx > -1) {
      cart[idx].qty = (cart[idx].qty || 0) + (item.qty || 1);
    } else {
      cart.push({
        id: item.id,
        name: item.name || "",
        price: item.price || 0,
        img: item.img || "",
        qty: item.qty || 1,
      });
    }
    saveCart(cart);
  }

  function updateQty(id, qty) {
    const cart = getCart();
    const idx = findIndexById(cart, id);
    if (idx === -1) return;
    if (qty <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].qty = qty;
    }
    saveCart(cart);
  }

  function removeItem(id) {
    const cart = getCart().filter((i) => i.id !== id);
    saveCart(cart);
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: { cart: [] } })
    );
  }

  window.CartAPI = {
    getCart,
    saveCart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
  };
})();
