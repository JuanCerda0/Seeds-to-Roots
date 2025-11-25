/* 
==================================
Productos
==================================
*/
let products = [
    {
        id: 1,
        name: "Manzanas Fuji",
        price: 2990,
        category: "Frutas",
        image: "../components/img/ManzanaFuji.webp",
        description: "Manzanas Fuji frescas y crujientes, cultivadas localmente. Perfectas para comer directamente o en ensaladas. Alto contenido de fibra y antioxidantes.",
        custom: "Orgánicas - Sin pesticidas"
    },
    {
        id: 2,
        name: "Naranjas Valencia",
        price: 2490,
        category: "Frutas",
        image: "../components/img/Naranjas Valencia.webp",
        description: "Naranjas Valencia jugosas y dulces, ideales para jugo fresco. Rica fuente de vitamina C y perfectas para fortalecer el sistema inmunológico.",
        custom: "De temporada - Recién cosechadas"
    },
    {
        id: 3,
        name: "Plátanos Cavendish",
        price: 1990,
        category: "Frutas",
        image: "../components/img/Plátanos Cavendish.webp",
        description: "Plátanos Cavendish maduros y dulces. Excelente fuente de potasio y energía natural. Perfectos para batidos, postres o como snack saludable.",
        custom: "Maduración perfecta"
    },
    {
        id: 4,
        name: "Zanahorias Orgánicas",
        price: 1790,
        category: "Verduras",
        image: "../components/img/Zanahorias Orgánicas.webp",
        description: "Zanahorias orgánicas frescas del campo. Ricas en betacaroteno y vitamina A. Perfectas para ensaladas, jugos o preparaciones cocidas.",
        custom: "100% Orgánico - Certificado"
    },
    {
        id: 5,
        name: "Espinacas Frescas",
        price: 2290,
        category: "Verduras",
        image: "../components/img/Espinacas Frescas.webp",
        description: "Espinacas frescas y tiernas, cosechadas en el día. Alto contenido de hierro y nutrientes esenciales. Ideales para ensaladas y smoothies verdes.",
        custom: "Cosecha del día"
    },
    {
        id: 6,
        name: "Pimientos Tricolores",
        price: 3490,
        category: "Verduras",
        image: "../components/img/Pimientos Tricolores.webp",
        description: "Mix de pimientos rojos, amarillos y verdes. Crujientes y llenos de sabor. Excelente fuente de vitamina C y perfectos para cualquier preparación.",
        custom: "Pack variado"
    },
    {
        id: 7,
        name: "Miel Orgánica",
        price: 5990,
        category: "Miel y Endulzantes",
        image: "../components/img/Miel Orgánica.webp",
        description: "Miel pura y orgánica de producción local. Sin aditivos ni conservantes. Endulzante natural con propiedades antibacterianas y antioxidantes.",
        custom: "500g - Producción artesanal"
    },
    {
        id: 8,
        name: "Leche Fresca",
        price: 1290,
        category: "Lácteos",
        image: "../components/img/Leche.webp",
        description: "Leche fresca de vaca, de granjas locales. Pasteurizada y enriquecida con vitaminas A y D. Perfecta para toda la familia.",
        custom: "1 Litro - Granja local"
    }
];

let selectedProductId = null;

// ===========================================
// FUNCIONES DE RENDERIZADO
// ===========================================

// Renderizar catálogo de productos
function renderCatalog() {
    const container = document.getElementById('productsList');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-product">
                <h2>No hay productos disponibles</h2>
                <p>Agrega productos desde la sección de Administración</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <article class="category-card" onclick="selectProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <p class="product-price">$${product.price.toLocaleString('es-CL')}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-custom">${product.custom}</p>
            </div>
            <button class="btn">🛒 Ver Detalles 🛒</button>
        </article>
    `).join('');
}

// Renderizar detalle del producto
function renderProductDetail() {
    const container = document.getElementById('productDetail');
    const product = products.find(p => p.id === selectedProductId);
    
    if (!product) {
        container.innerHTML = `
            <div class="no-product">
                <h2>Producto no encontrado</h2>
                <p>Selecciona un producto del catálogo</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="product-detail">
            <div>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="price">$${product.price.toLocaleString('es-CL')}</div>
                <span class="category">${product.category}</span>
                <div class="description">${product.description}</div>
                <div class="custom">${product.custom}</div>
                <button class="btn">🛒 Agregar al Carrito 🛒</button>
            </div>
        </div>
    `;
}

// Renderizar lista en administración
function renderAdminList() {
    const container = document.getElementById('adminProductsList');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No hay productos guardados</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p>$${product.price.toLocaleString('es-CL')} - ${product.category}</p>
            </div>
            <button class="btn delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
        </div>
    `).join('');
}

// ===========================================
// FUNCIONES DE NAVEGACIÓN
// ===========================================

// Cambiar entre pestañas
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    
    if (!event || !event.target) {
        const tabs = document.querySelectorAll('.tab');
        if (tabName === 'catalog') tabs[0].classList.add('active');
        if (tabName === 'detail') tabs[1].classList.add('active');
        if (tabName === 'admin') tabs[2].classList.add('active');
    }
}

// Seleccionar producto y mostrar detalle
function selectProduct(id) {
    selectedProductId = id;
    renderProductDetail();
    switchTab('detail');
}

// ===========================================
// FUNCIONES DE ADMINISTRACIÓN
// ===========================================

// Agregar nuevo producto
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;
    const custom = document.getElementById('productCustom').value;
    
    if (!name || !price || !image || !description) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        category,
        image,
        description,
        custom: custom || 'Producto fresco'
    };
    
    products.push(newProduct);
    
    // Limpiar formulario
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCustom').value = '';
    
    renderAdminList();
    renderCatalog();
    
    alert('Producto agregado exitosamente ✅');
}

// Eliminar producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        renderAdminList();
        renderCatalog();
    }
}

// ===========================================
// INICIALIZACIÓN
// ===========================================
renderCatalog();
renderAdminList();
