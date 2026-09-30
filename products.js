window.ProductApp = window.ProductApp || {};

window.ProductApp.mockProducts = [
  {
    id: 'prod_001',
    name: 'Aura Wireless Noise-Cancelling Headphones',
    category: 'Audio',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewsCount: 128,
    description: 'Custom 40mm beryllium drivers deliver high-resolution spatial audio with active noise cancellation and up to 40 hours of continuous playback.',
    features: [
      'Active Noise Cancelling (ANC) with transparency mode',
      '40-hour battery life with USB-C ultra-fast charging',
      'Plush memory foam ear cushions & lightweight titanium headband',
      'Bluetooth 5.3 multipoint connectivity'
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller'
  },
  {
    id: 'prod_002',
    name: 'Quantum Smartwatch Series X',
    category: 'Wearables',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 94,
    description: 'Sleek AMOLED sapphire glass display featuring advanced ECG heart monitoring, dual-band GPS tracking, and a lightweight aerospace titanium bezel.',
    features: [
      'Always-On AMOLED display with 1000 nits brightness',
      'Advanced biometric sensors (ECG, SpO2, Heart Rate)',
      '50m water resistance (5 ATM rated)',
      '7-day battery life per single charge'
    ],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    badge: 'New Arrival'
  },
  {
    id: 'prod_003',
    name: 'Lumina Mechanical RGB Keyboard',
    category: 'Workstation',
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviewsCount: 210,
    description: 'Hot-swappable tactile RGB switches housed inside a precision CNC-milled aluminum chassis with tri-mode wireless connection.',
    features: [
      'Gateron Pro Tactile Yellow pre-lubed mechanical switches',
      'PBT double-shot keycaps with south-facing RGB lighting',
      'Tri-mode: 2.4GHz Wireless, Bluetooth 5.1 & USB-C Cable',
      '4000mAh long-lasting rechargeable battery'
    ],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    badge: 'Hot'
  },
  {
    id: 'prod_004',
    name: 'ErgoGrip Vertical Wireless Mouse',
    category: 'Accessories',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviewsCount: 76,
    description: 'Ergonomic 57° vertical contouring engineered to reduce wrist strain and muscle tension while maintaining 26,000 DPI ultra-precision tracking.',
    features: [
      'Natural handshake position reduces forearm strain',
      'Precision optical sensor adjustable up to 26,000 DPI',
      'Silent magnetic scroll wheel with smart-shift scrolling',
      'Multi-device pairing up to 3 computers simultaneously'
    ],
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    badge: null
  },
  {
    id: 'prod_005',
    name: 'AuraSound Portable Hi-Fi Speaker',
    category: 'Audio',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviewsCount: 185,
    description: '360° omnidirectional sound system with IP67 dust and waterproof rating, custom dual passive radiators, and deep punchy bass resonance.',
    features: [
      'IP67 fully dustproof & waterproof construction',
      '24 hours of continuous continuous playtime',
      'TWS stereo pairing capability with second unit',
      'Built-in noise-cancelling speakerphone mic'
    ],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular'
  },
  {
    id: 'prod_006',
    name: 'Studio Ultra-HD 4K Streaming Camera',
    category: 'Electronics',
    price: 169.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewsCount: 52,
    description: 'Professional 4K 60fps webcam with Sony STARVIS CMOS sensor, AI auto-framing focus, and built-in adjustable ring illumination.',
    features: [
      '4K UHD resolution at smooth 60 frames per second',
      'Sony STARVIS sensor for superior low-light clarity',
      'Dual omnidirectional noise-reducing microphones',
      'Integrated physical privacy shutter'
    ],
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    badge: null
  }
];

window.ProductApp.productService = {
  async getProducts() {
    return new Promise((resolve) => setTimeout(() => resolve(window.ProductApp.mockProducts), 100));
  },
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  }
};

window.ProductApp.renderProducts = function(products, containerId = 'productGridContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `<div class="text-center" style="grid-column:1/-1;padding:3rem;">No products found.</div>`;
    return;
  }

  const cardsHtml = products.map(product => {
    const badgeHtml = product.badge ? `<span class="product-card-badge">${product.badge}</span>` : '';
    const origPriceHtml = product.originalPrice ? `<span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>` : '';

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-image-container">
          ${badgeHtml}
          <a href="product.html?id=${product.id}">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="product-image"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';"
            />
          </a>
          <div class="product-overlay-actions">
            <a href="product.html?id=${product.id}" class="quick-view-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>View Details</span>
            </a>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-meta">
            <span class="product-category">${product.category}</span>
            <div class="product-rating">
              <span class="rating-score">★ ${product.rating}</span>
              <span class="reviews-count">(${product.reviewsCount})</span>
            </div>
          </div>

          <h3 class="product-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>
          <p class="product-description">${product.description}</p>

          <div class="product-card-footer">
            <div class="product-price-block">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              ${origPriceHtml}
            </div>

            <div class="product-actions-group">
              <a href="product.html?id=${product.id}" class="btn btn-secondary btn-icon-only" title="View Details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </a>

              <button 
                type="button" 
                class="btn btn-primary add-to-cart-btn" 
                data-action="add-to-cart" 
                data-product-id="${product.id}"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = cardsHtml;

  container.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action="add-to-cart"]');
    if (!actionBtn) return;

    const productId = actionBtn.getAttribute('data-product-id');
    const targetProduct = products.find(p => String(p.id) === String(productId));

    if (targetProduct && window.CartApp && window.CartApp.cart) {
      window.CartApp.cart.addToCart(targetProduct, 1);
    }
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('productGridContainer')) {
    const products = await window.ProductApp.productService.getProducts();
    window.ProductApp.renderProducts(products, 'productGridContainer');
  }
});
