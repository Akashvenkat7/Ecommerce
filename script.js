document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const searchInput = document.getElementById('search');
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDescription = document.getElementById('modal-description');
  const modalQuantity = document.getElementById('modal-quantity');
  const closeModal = document.getElementById('close-modal');
  
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCountElement = document.getElementById('cart-count');
  
  let cart = [];

  // Fetch products from Fake Store API
  async function fetchProducts() {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      displayProducts(products);
  }

  // Display products in cards
  function displayProducts(products) {
      productList.innerHTML = '';
      products.forEach(product => {
          const productCard = `
              <div class="bg-white p-4 rounded-lg shadow-md">
                  <img src="${product.image}" class="w-full h-64 object-cover mb-4">
                  <h3 class="text-lg font-bold">${product.title}</h3>
                  <p class="text-gray-700">$${product.price}</p>
                  <button class="bg-blue-500 text-white p-2 rounded mt-4" onclick="showModal(${product.id})">View More</button>
                  <button class="bg-green-500 text-white p-2 rounded mt-4" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
              </div>
          `;
          productList.innerHTML += productCard;
      });
  }

  // Show product details in modal
  window.showModal = async function(id) {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const product = await response.json();

      modalTitle.textContent = product.title;
      modalImage.src = product.image;
      modalDescription.textContent = product.description;
      modalQuantity.textContent = `Quantity Available: ${product.rating.count}`;
      
      modal.classList.remove('hidden');
      modal.classList.add('flex');
  };

  // Close product modal
  closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
  });

  // Search functionality
  searchInput.addEventListener('input', async (e) => {
      const searchText = e.target.value.toLowerCase();
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchText));
      displayProducts(filteredProducts);
  });

  // Cart functionality
  window.addToCart = function(id, title, price, image) {
      const productInCart = cart.find(item => item.id === id);
      if (!productInCart) {
          cart.push({ id, title, price, image, quantity: 1 });
      } else {
          productInCart.quantity++;
      }
      updateCartUI();
  };

  function updateCartUI() {
      cartCountElement.textContent = cart.length;
      cartItemsContainer.innerHTML = cart.map(item => `
          <div class="flex justify-between items-center mb-4">
              <img src="${item.image}" class="w-16 h-16 object-cover">
              <div>
                  <h3 class="font-bold">${item.title}</h3>
                  <p>$${item.price} x ${item.quantity}</p>
              </div>
              <button class="bg-red-500 text-white p-2 rounded" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
      `).join('');
  }

  window.removeFromCart = function(id) {
      cart = cart.filter(item => item.id !== id);
      updateCartUI();
  };

  // Open and close cart modal
  cartBtn.addEventListener('click', () => {
      cartModal.classList.remove('hidden');
      cartModal.classList.add('flex');
  });

  closeCart.addEventListener('click', () => {
      cartModal.classList.add('hidden');
  });

  fetchProducts();
});
