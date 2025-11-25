/**
 * Sistema de Visualización de Productos - Cliente
 * Solo muestra catálogo y detalles (sin administración)
 */

const api = new APIClient();
let currentProduct = null;

// ===========================================
// FUNCIONES DE NAVEGACIÓN
// ===========================================

/**
 * Cambia entre vista de catálogo y detalle
 */
function switchTab(tabName) {
    const catalog = document.getElementById('catalog');
    const detail = document.getElementById('detail');
    
    if (tabName === 'catalog') {
        catalog.classList.add('active');
        detail.classList.remove('active');
    } else if (tabName === 'detail') {
        catalog.classList.remove('active');
        detail.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================================
// FUNCIONES DEL CATÁLOGO
// ===========================================

/**
 * Carga todos los productos desde la API
 */
async function loadProducts() {
    const container = document.getElementById('productsList');
    container.innerHTML = '<div class="loading-message">🌱 Cargando productos frescos...</div>';
    
    try {
        const response = await api.getProductos();
        
        if (!response.success) {
            throw new Error(response.error || 'Error al cargar productos');
        }
        
        const productos = response.data;
        
        if (!productos || productos.length === 0) {
            container.innerHTML = `
                <div class="no-products-message">
                    <h3>No hay productos disponibles</h3>
                    <p>Vuelve pronto para ver nuestros productos frescos</p>
                </div>
            `;
            return;
        }
        
        renderProducts(productos);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        container.innerHTML = `
            <div class="error-message">
                <h3>❌ Error al cargar productos</h3>
                <p>${error.message}</p>
                <button class="btn" onclick="loadProducts()">🔄 Reintentar</button>
            </div>
        `;
    }
}

/**
 * Renderiza los productos en el grid
 */
function renderProducts(productos) {
    const container = document.getElementById('productsList');
    
    container.innerHTML = productos.map(producto => {
        // Determinar estado del stock
        let stockClass = 'stock-disponible';
        let stockText = `Stock: ${producto.stock} disponibles`;
        
        if (producto.stock === 0) {
            stockClass = 'stock-agotado';
            stockText = 'Agotado';
        } else if (producto.stock <= 10) {
            stockClass = 'stock-bajo';
            stockText = `¡Últimas ${producto.stock} unidades!`;
        }
        
        return `
            <article class="product-card" onclick="viewProductDetail(${producto.id})">
                <div class="product-image">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${producto.nombre}</h3>
                    <p class="product-category">${producto.categoria}</p>
                    <p class="product-price">$${producto.precio.toLocaleString('es-CL')}</p>
                    <span class="product-stock ${stockClass}">${stockText}</span>
                    ${producto.caracteristicas ? `
                        <p class="product-custom">✨ ${producto.caracteristicas}</p>
                    ` : ''}
                </div>
                <button class="btn btn-primary" onclick="viewProductDetail(${producto.id}); event.stopPropagation();">
                    👁️ Ver Detalles
                </button>
            </article>
        `;
    }).join('');
}

// ===========================================
// FUNCIONES DE DETALLE DE PRODUCTO
// ===========================================

/**
 * Muestra el detalle de un producto
 */
async function viewProductDetail(productId) {
    const container = document.getElementById('productDetail');
    container.innerHTML = '<div class="loading-message">Cargando detalles del producto...</div>';
    
    // Cambiar a vista de detalle
    switchTab('detail');
    
    try {
        const response = await api.getProductoById(productId);
        
        if (!response.success) {
            throw new Error(response.error || 'Producto no encontrado');
        }
        
        currentProduct = response.data;
        renderProductDetail(currentProduct);
        
    } catch (error) {
        console.error('Error al cargar detalle:', error);
        container.innerHTML = `
            <div class="error-message">
                <h3>❌ Error al cargar el producto</h3>
                <p>${error.message}</p>
                <button class="btn" onclick="switchTab('catalog')">← Volver al catálogo</button>
            </div>
        `;
    }
}

/**
 * Renderiza el detalle completo del producto
 */
function renderProductDetail(producto) {
    const container = document.getElementById('productDetail');
    
    // Determinar estado del stock
    let stockClass = 'stock-disponible';
    let stockText = `${producto.stock} unidades disponibles`;
    let btnDisabled = '';
    let btnText = '🛒 Agregar al Carrito';
    
    if (producto.stock === 0) {
        stockClass = 'stock-agotado';
        stockText = 'Producto agotado';
        btnDisabled = 'disabled';
        btnText = '❌ Producto Agotado';
    } else if (producto.stock <= 10) {
        stockClass = 'stock-bajo';
        stockText = `¡Solo quedan ${producto.stock} unidades!`;
    }
    
    container.innerHTML = `
        <div class="product-detail-container">
            <div class="product-detail-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                ${producto.caracteristicas ? `
                    <div class="product-badge">✨ ${producto.caracteristicas}</div>
                ` : ''}
            </div>
            
            <div class="product-detail-content">
                <div class="product-detail-header">
                    <span class="product-detail-category">📦 ${producto.categoria}</span>
                    <h1 class="product-detail-title">${producto.nombre}</h1>
                </div>
                
                <div class="product-detail-price-section">
                    <span class="product-detail-price">$${producto.precio.toLocaleString('es-CL')}</span>
                    <span class="product-detail-stock ${stockClass}">
                        ${stockText}
                    </span>
                </div>
                
                <div class="product-detail-description">
                    <h3>📝 Descripción</h3>
                    <p>${producto.descripcion}</p>
                </div>
                
                <div class="product-detail-actions">
                    <button class="btn btn-primary btn-large" ${btnDisabled} onclick="addToCart(${producto.id})">
                        ${btnText}
                    </button>
                    <button class="btn btn-secondary" onclick="switchTab('catalog')">
                        ← Seguir Comprando
                    </button>
                </div>
                
                <div class="product-detail-info">
                    <div class="info-item">
                        <span class="info-icon">🚚</span>
                        <span>Envío gratis en compras sobre $30.000</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🌱</span>
                        <span>Productos frescos directo del campo</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">💚</span>
                        <span>Apoyamos a agricultores locales</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===========================================
// FUNCIÓN DE CARRITO
// ===========================================

/**
 * Agrega un producto al carrito
 */
async function addToCart(productId) {
    if (!currentProduct) {
        alert('❌ Error: Producto no encontrado');
        return;
    }
    
    // Obtener usuario logueado (simulado - ajustar según tu sistema de login)
    const userId = getUserId();
    
    if (!userId) {
        alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
        // Redirigir al login
        window.location.href = 'log-in.html';
        return;
    }
    
    try {
        const item = {
            productoId: currentProduct.id,
            nombre: currentProduct.nombre,
            precio: currentProduct.precio,
            cantidad: 1,
            imagen: currentProduct.imagen
        };
        
        const response = await api.addToCart(userId, item);
        
        if (response.success) {
            // Mostrar notificación de éxito
            showNotification(`✅ ${currentProduct.nombre} agregado al carrito`, 'success');
            
            // Opcional: Actualizar contador del carrito en el header
            updateCartCount();
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        showNotification('❌ Error al agregar al carrito. Intenta nuevamente.', 'error');
    }
}

// ===========================================
// FUNCIONES AUXILIARES
// ===========================================

/**
 * Obtiene el ID del usuario logueado
 * (Ajustar según tu sistema de autenticación)
 */
function getUserId() {
    // Buscar en localStorage o sessionStorage
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
        try {
            const session = JSON.parse(userSession);
            return session.userId || session.id;
        } catch (e) {
            console.error('Error al parsear sesión:', e);
        }
    }
    return null;
}

/**
 * Actualiza el contador del carrito en el header
 */
function updateCartCount() {
    // Implementar según tu sistema de carrito
    const cartIcon = document.querySelector('[title="Carrito"]');
    if (cartIcon) {
        // Agregar badge o actualizar contador
        console.log('Carrito actualizado');
    }
}

/**
 * Muestra una notificación temporal
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================================
// INICIALIZACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos al iniciar
    loadProducts();
    
    // Verificar si hay un producto específico en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        viewProductDetail(parseInt(productId));
    }
});