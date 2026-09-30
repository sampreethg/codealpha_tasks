window.CheckoutApp = window.CheckoutApp || {};

document.addEventListener('DOMContentLoaded', () => {
  const { cart } = window.CartApp || {};
  if (!cart) return;

  const items = cart.getItems();
  const totals = cart.getTotals();

  const summaryContainer = document.getElementById('checkoutSummaryItems');
  const checkoutForm = document.getElementById('checkoutForm');

  if (!items || items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  if (summaryContainer) {
    summaryContainer.innerHTML = items.map(item => `
      <div class="checkout-summary-item">
        <div class="summary-item-img">
          <img src="${item.image}" alt="${item.name}" />
          <span class="summary-item-qty">${item.quantity}</span>
        </div>
        <div class="summary-item-details">
          <h4 class="summary-item-title">${item.name}</h4>
          <span class="summary-item-cat">${item.category}</span>
        </div>
        <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
  }

  if (document.getElementById('checkoutSubtotal')) {
    document.getElementById('checkoutSubtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${totals.tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${totals.total.toFixed(2)}`;
  }

  const paymentTabs = document.querySelectorAll('.payment-tab');
  const cardFields = document.getElementById('creditCardFields');
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const method = tab.getAttribute('data-method');
      if (cardFields) {
        cardFields.style.display = method === 'card' ? 'block' : 'none';
      }
    });
  });

  const cardInput = document.getElementById('cardNumber');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = val;
    });
  }

  const expiryInput = document.getElementById('cardExpiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
    });
  }

  function validateField(input, condition, errorMsg) {
    const group = input.closest('.form-group');
    if (!group) return true;

    if (!condition) {
      input.classList.add('is-invalid');
      let errSpan = group.querySelector('.error-message');
      if (!errSpan) {
        errSpan = document.createElement('span');
        errSpan.className = 'error-message';
        group.appendChild(errSpan);
      }
      errSpan.textContent = errorMsg;
      group.classList.add('has-error');
      return false;
    } else {
      input.classList.remove('is-invalid');
      group.classList.remove('has-error');
      return true;
    }
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('custEmail');
      const fullName = document.getElementById('custName');
      const phone = document.getElementById('custPhone');
      const street = document.getElementById('shipStreet');
      const city = document.getElementById('shipCity');
      const zip = document.getElementById('shipZip');
      const country = document.getElementById('shipCountry');

      let isValid = true;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validateField(email, emailRegex.test(email.value.trim()), 'Please enter a valid email address')) isValid = false;
      if (!validateField(fullName, fullName.value.trim().length >= 2, 'Full name required')) isValid = false;
      if (!validateField(phone, phone.value.trim().length >= 7, 'Valid phone number required')) isValid = false;
      if (!validateField(street, street.value.trim().length >= 5, 'Street address required')) isValid = false;
      if (!validateField(city, city.value.trim().length >= 2, 'City required')) isValid = false;
      if (!validateField(zip, zip.value.trim().length >= 3, 'Postal code required')) isValid = false;
      if (!validateField(country, country.value.trim().length >= 2, 'Country selection required')) isValid = false;

      const activeTab = document.querySelector('.payment-tab.active');
      const method = activeTab ? activeTab.getAttribute('data-method') : 'card';

      if (method === 'card') {
        const cNum = document.getElementById('cardNumber');
        const cExp = document.getElementById('cardExpiry');
        const cCvv = document.getElementById('cardCvv');
        const cName = document.getElementById('cardName');

        const cleanCard = cNum.value.replace(/\s/g, '');
        if (!validateField(cNum, cleanCard.length === 16, 'Enter a valid 16-digit card number')) isValid = false;
        if (!validateField(cExp, /^\d{2}\/\d{2}$/.test(cExp.value), 'Format MM/YY')) isValid = false;
        if (!validateField(cCvv, /^\d{3,4}$/.test(cCvv.value.trim()), '3 or 4 digits')) isValid = false;
        if (!validateField(cName, cName.value.trim().length >= 2, 'Name on card required')) isValid = false;
      }

      if (!isValid) {
        const firstErr = document.querySelector('.is-invalid');
        if (firstErr) firstErr.focus();
        return;
      }

      const submitBtn = document.getElementById('placeOrderBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing Secure Payment...</span>`;

      const orderId = `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderPayload = {
        orderId,
        customer: {
          name: fullName.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim()
        },
        shippingAddress: {
          street: street.value.trim(),
          city: city.value.trim(),
          zip: zip.value.trim(),
          country: country.value.trim()
        },
        paymentMethod: method,
        items,
        totals,
        createdAt: new Date().toISOString()
      };

      console.log('%c[Order Processed Successfully]', 'background: #10b981; color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px;', orderPayload);

      sessionStorage.setItem('aurastore_last_order', JSON.stringify(orderPayload));

      setTimeout(() => {
        cart.clearCart();
        window.location.href = `success.html?orderId=${orderId}`;
      }, 800);
    });

    checkoutForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
          const grp = input.closest('.form-group');
          if (grp) grp.classList.remove('has-error');
        }
      });
    });
  }
});
