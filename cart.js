window.CartApp = window.CartApp || {};

const STORAGE_KEY = 'aurastore_cart_v2';

window.CartApp.storage = {
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[CartStorage] Failed to read cart from localStorage', e);
      return [];
    }
  },

  saveCart(cartItems) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      window.CartApp.notifyCartUpdated();
    } catch (e) {
      console.error('[CartStorage] Failed to save cart to localStorage', e);
    }
  }
};

window.CartApp.cart = {
  getItems() {
    return window.CartApp.storage.getCart();
  },

  addToCart(productOrId, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    let product = productOrId;

    if (typeof productOrId === 'string' || typeof productOrId === 'number') {
      const mockList = (window.ProductApp && window.ProductApp.mockProducts) ? window.ProductApp.mockProducts : [];
      product = mockList.find(p => String(p.id) === String(productOrId));
    }

    if (!product || !product.id) {
      console.error('[CartApp] Invalid product passed to addToCart:', productOrId);
      return false;
    }

    const items = this.getItems();
    const existingIndex = items.findIndex(item => String(item.id) === String(product.id));

    if (existingIndex > -1) {
      items[existingIndex].quantity += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        category: product.category || 'General',
        price: parseFloat(product.price),
        image: product.image,
        description: product.description || '',
        quantity: qty
      });
    }

    window.CartApp.storage.saveCart(items);

    if (window.AuthApp && window.AuthApp.ui && window.AuthApp.ui.showToast) {
      window.AuthApp.ui.showToast(
        'Added to Cart', 
        `"${product.name}" (${qty}x) was added to your bag.`, 
        'success'
      );
    }

    return true;
  },

  removeFromCart(productId) {
    let items = this.getItems();
    items = items.filter(item => String(item.id) !== String(productId));
    window.CartApp.storage.saveCart(items);
  },

  updateQuantity(productId, newQuantity) {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.getItems();
    const item = items.find(i => String(i.id) === String(productId));
    if (item) {
      item.quantity = qty;
      window.CartApp.storage.saveCart(items);
    }
  },

  clearCart() {
    window.CartApp.storage.saveCart([]);
  },

  getTotals() {
    const items = this.getItems();
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 99 || subtotal === 0 ? 0 : 12.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      freeShippingThreshold: 99,
      amountNeededForFreeShipping: Math.max(0, 99 - subtotal)
    };
  }
};

window.CartApp.notifyCartUpdated = function() {
  const totals = window.CartApp.cart.getTotals();
  
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totals.itemCount;
    badge.classList.add('badge-bounce');
    setTimeout(() => badge.classList.remove('badge-bounce'), 300);
  });

  window.dispatchEvent(new CustomEvent('cartStateChanged', { detail: totals }));
};

document.addEventListener('DOMContentLoaded', () => {
  window.CartApp.notifyCartUpdated();

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      window.CartApp.notifyCartUpdated();
    }
  });
});
