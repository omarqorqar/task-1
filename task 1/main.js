// جلب البيانات من ملف JSON
fetch('main.json')
  .then(response => response.json())
  .then(data => {
    const productContainer = document.getElementById('product-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    let cart = [];

    // عرض المنتجات في الصفحة
    data.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;

      productContainer.appendChild(productDiv);
    });

    // إضافة المنتج للسلة
    productContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        const selectedProduct = data.find(product => product.id === productId);

        addToCart(selectedProduct);
      }
    });

    // دالة لإضافة المنتج للسلة
    function addToCart(product) {
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      updateCartUI();
    }

    // تحديث واجهة السلة
    function updateCartUI() {
      cartItemsContainer.innerHTML = '';
      let totalPrice = 0;

      cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <p>${item.name}</p>
          <div class="quantity-control">
            <button class="quantity-btn decrease" data-id="${item.id}">➖</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${item.id}">➕</button>
          </div>
          <p>$${item.quantity * item.price}</p>
        `;

        cartItemsContainer.appendChild(cartItemDiv);

        totalPrice += item.quantity * item.price;
      });

      totalPriceElement.textContent = totalPrice;
    }

    // التحكم في الكمية (زيادة أو نقصان)
    cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('increase')) {
        const productId = parseInt(e.target.dataset.id);
        const cartItem = cart.find(item => item.id === productId);
        cartItem.quantity += 1;
        updateCartUI();
      } else if (e.target.classList.contains('decrease')) {
        const productId = parseInt(e.target.dataset.id);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
        } else {
          cart = cart.filter(item => item.id !== productId);
        }
        updateCartUI();
      }
    });

    // زرار تأكيد الطلب
    document.getElementById('confirm-btn').addEventListener('click', () => {
      if (cart.length > 0) {
        alert('Order Confirmed Successfully! ✅');
        console.log('Order Details:', cart);
        cart = [];
        updateCartUI();
      } else {
        alert('Your cart is empty! 🛒');
      }
    });

    // زرار إغلاق السلة
    document.getElementById('close-btn').addEventListener('click', () => {
      cartItemsContainer.innerHTML = '';
      totalPriceElement.textContent = '0';
      cart = [];
    });
  })
  .catch(error => console.error('Error fetching data:', error));
