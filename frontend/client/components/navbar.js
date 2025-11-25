/**
 * Carga la barra de navegación con rutas relativas correctas
 * Ubicación del script: frontend/client/components/navbar.js
 * @param {string} currentPage - Nombre de la página actual ('index', 'cart', 'contact', 'login', 'signin')
 */
function loadNavBar(currentPage = 'index') {
  // Determinar rutas según la página actual
  let routes, imagePath;
  
  if (currentPage === 'index') {
    // Desde index.html (frontend/client/index.html)
    routes = {
      home: './index.html',
      products: './index.html#productos',
      about: './index.html#nosotros',
      blogs: './index.html#blogs',
      contact: './pages/contact.html',
      cart: './pages/cart.html',
      login: './pages/log-in.html',
      signin: './pages/sign-in.html'
    };
    imagePath = './assets/images/';
  } else {
    // Desde páginas dentro de /pages/ (frontend/client/pages/*.html)
    routes = {
      home: '../index.html',
      products: '../index.html#productos',
      about: '../index.html#nosotros',
      blogs: '../index.html#blogs',
      contact: './contact.html',
      cart: './cart.html',
      login: './log-in.html',
      signin: './sign-in.html'
    };
    imagePath = '../assets/images/';
  }

  const navHTML = `
    <header class="navbar">
      <div class="navbar-brand">
        <img src="${imagePath}logo.png" alt="Logo Waifu Farm" class="navbar-logo" onerror="this.style.display='none'">
        <h1>Waifu Farm</h1>
      </div>

      <nav>
        <ul class="navbar-menu">
          <li><a href="${routes.home}" class="${currentPage === 'index' ? 'active' : ''}">Home</a></li>
          <li><a href="${routes.products}">Productos</a></li>
          <li><a href="${routes.about}">Nosotros</a></li>
          <li><a href="${routes.blogs}">Blogs</a></li>
          <li><a href="${routes.contact}" class="${currentPage === 'contact' ? 'active' : ''}">Contacto</a></li>
        </ul>
      </nav>

      <div class="navbar-cart">
        <a href="${routes.cart}" class="cart-link ${currentPage === 'cart' ? 'active' : ''}">
          <img src="${imagePath}cart-icon.png" alt="Carrito" class="cart-icon" onerror="this.style.display='none'">
          <span class="cart-text">Cart (<span id="cart-count">0</span>)</span>
        </a>
      </div>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
  updateCartCount();
}

/**
 * Actualiza el contador del carrito desde localStorage
 */
function updateCartCount() {
  const cartCount = localStorage.getItem('cartCount') || 0;
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = cartCount;
  }
}

/**
 * Agrega un item al carrito
 */
function addToCart() {
  let count = parseInt(localStorage.getItem('cartCount') || 0);
  count++;
  localStorage.setItem('cartCount', count);
  updateCartCount();
}

/**
 * Limpia el carrito
 */
function clearCart() {
  localStorage.setItem('cartCount', 0);
  updateCartCount();
}