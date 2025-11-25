/**
 * API Mock - Simula peticiones a un backend
 * Los datos se obtienen de archivos JSON en mockData/
 */

class APIClient {
    /**
     * Obtiene el carrito de un usuario por su ID
     * @param {number} usuarioId
     * @returns {Promise}
     */
    async getCart(usuarioId) {
      try {
        const data = await this._fetchData(`${this.baseUrl}/carritos.json`);
        const carrito = data.data.find(c => c.usuarioId === usuarioId);
        if (!carrito) {
          return {
            success: false,
            error: 'Carrito no encontrado',
            data: null
          };
        }
        return {
          success: true,
          data: carrito,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error al obtener carrito:', error);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
    }

    /**
     * Agrega un producto al carrito de un usuario
     * @param {number} usuarioId
     * @param {Object} item - { productoId, nombre, precio, cantidad }
     * @returns {Promise}
     */
    async addToCart(usuarioId, item) {
      // Simulación: solo retorna el item agregado
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { usuarioId, item },
            message: 'Producto agregado al carrito',
            timestamp: new Date().toISOString()
          });
        }, this.timeout);
      });
    }

    /**
     * Elimina un producto del carrito de un usuario
     * @param {number} usuarioId
     * @param {number} productoId
     * @returns {Promise}
     */
    async removeFromCart(usuarioId, productoId) {
      // Simulación: solo retorna el producto eliminado
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { usuarioId, productoId },
            message: 'Producto eliminado del carrito',
            timestamp: new Date().toISOString()
          });
        }, this.timeout);
      });
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     * @param {number} usuarioId
     * @param {number} productoId
     * @param {number} cantidad
     * @returns {Promise}
     */
    async updateCart(usuarioId, productoId, cantidad) {
      // Simulación: solo retorna la actualización
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { usuarioId, productoId, cantidad },
            message: 'Cantidad actualizada en el carrito',
            timestamp: new Date().toISOString()
          });
        }, this.timeout);
      });
    }

    /**
     * Simula el login de usuario (por email y password)
     * @param {string} email
     * @param {string} password
     * @returns {Promise}
     */
    async loginUser(email, password) {
      try {
        const data = await this._fetchData(`${this.baseUrl}/usuarios.json`);
        const usuario = data.data.find(u => u.email === email);
        if (!usuario) {
          return { success: false, error: 'Usuario no encontrado', data: null };
        }
        // Validar contra el campo password real
        if (usuario.password !== password) {
          return { success: false, error: 'Contraseña incorrecta', data: null };
        }
        return {
          success: true,
          data: usuario,
          message: 'Login exitoso',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return { success: false, error: error.message, data: null };
      }
    }

    /**
     * Simula el registro de usuario
     * @param {Object} usuario - { nombre, email, password, ... }
     * @returns {Promise}
     */
    async registerUser(usuario) {
      // Simulación: retorna el usuario con id aleatorio
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: Math.floor(Math.random() * 10000),
              ...usuario,
              fechaRegistro: new Date().toISOString(),
              fechaActualizacion: new Date().toISOString(),
              ultimoLogin: null
            },
            message: 'Usuario registrado exitosamente',
            timestamp: new Date().toISOString()
          });
        }, this.timeout);
      });
    }

    /**
     * Obtiene un usuario por email
     * @param {string} email
     * @returns {Promise}
     */
    async getUserByEmail(email) {
      try {
        const data = await this._fetchData(`${this.baseUrl}/usuarios.json`);
        const usuario = data.data.find(u => u.email === email);
        if (!usuario) {
          return { success: false, error: 'Usuario no encontrado', data: null };
        }
        return {
          success: true,
          data: usuario,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return { success: false, error: error.message, data: null };
      }
    }
  constructor(baseUrl = null) {
    // Detecta automáticamente la ruta correcta
    if (!baseUrl) {
      // Obtiene la URL actual del navegador
      const currentPath = window.location.pathname;
      // Si está en /admin/pages/, retrocede dos niveles
      if (currentPath.includes('/admin/pages/')) {
        this.baseUrl = '../../api/mockData';
      } else if (currentPath.includes('/admin/')) {
        this.baseUrl = '../api/mockData';
      } else {
        this.baseUrl = './api/mockData';
      }
    } else {
      this.baseUrl = baseUrl;
    }
    this.timeout = 500; // Simula latencia de red
  }

  /**
   * Método auxiliar para simular una petición HTTP
   * @param {string} url - URL del recurso
   * @returns {Promise} Promesa con los datos
   */
  async _fetchData(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error HTTP ${response.status}`);
            }
            return response.json();
          })
          .then(data => resolve(data))
          .catch(error => reject(error));
      }, this.timeout);
    });
  }

  /**
   * Obtiene todos los productos
   * @param {Object} options - Opciones de filtrado y paginación
   * @returns {Promise}
   */
  async getProductos(options = {}) {
    try {
      const data = await this._fetchData(`${this.baseUrl}/productos.json`);
      
      let productos = data.data || [];

      // Filtrar por categoría si se especifica
      if (options.categoria) {
        productos = productos.filter(p => 
          p.categoria.toLowerCase() === options.categoria.toLowerCase()
        );
      }

      // Filtrar por stock
      if (options.soloConStock) {
        productos = productos.filter(p => p.stock > 0);
      }

      // Paginación
      if (options.limit) {
        const start = (options.page || 1 - 1) * options.limit;
        productos = productos.slice(start, start + options.limit);
      }

      return {
        success: true,
        data: productos,
        total: data.total,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  async getProductoById(id) {
    try {
      const data = await this._fetchData(`${this.baseUrl}/productos.json`);
      const producto = data.data.find(p => p.id === id);

      if (!producto) {
        return {
          success: false,
          error: 'Producto no encontrado',
          data: null
        };
      }

      return {
        success: true,
        data: producto,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Obtiene todos los usuarios
   * @param {Object} options - Opciones de filtrado y paginación
   * @returns {Promise}
   */
  async getUsuarios(options = {}) {
    try {
      const data = await this._fetchData(`${this.baseUrl}/usuarios.json`);
      
      let usuarios = data.data || [];

      // Filtrar por estado
      if (options.estado) {
        usuarios = usuarios.filter(u => 
          u.estado.toLowerCase() === options.estado.toLowerCase()
        );
      }

      // Filtrar solo activos
      if (options.soloActivos) {
        usuarios = usuarios.filter(u => u.activo === true);
      }

      // Paginación
      if (options.limit) {
        const start = (options.page || 1 - 1) * options.limit;
        usuarios = usuarios.slice(start, start + options.limit);
      }

      return {
        success: true,
        data: usuarios,
        total: data.total,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise}
   */
  async getUsuarioById(id) {
    try {
      const data = await this._fetchData(`${this.baseUrl}/usuarios.json`);
      const usuario = data.data.find(u => u.id === id);

      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado',
          data: null
        };
      }

      return {
        success: true,
        data: usuario,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Obtiene estadísticas del dashboard
   * @returns {Promise}
   */
  async getEstadisticas() {
    try {
      const productosRes = await this._fetchData(`${this.baseUrl}/productos.json`);
      const usuariosRes = await this._fetchData(`${this.baseUrl}/usuarios.json`);

      const productos = productosRes.data || [];
      const usuarios = usuariosRes.data || [];

      // Calcular estadísticas
      const totalProductos = productos.length;
      const totalUsuarios = usuarios.length;
      const productosActivos = productos.filter(p => p.activo).length;
      const usuariosActivos = usuarios.filter(u => u.activo).length;
      const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);
      const precioPromedio = (productos.reduce((sum, p) => sum + p.precio, 0) / totalProductos).toFixed(2);

      return {
        success: true,
        data: {
          totalProductos,
          totalUsuarios,
          productosActivos,
          usuariosActivos,
          stockTotal,
          precioPromedio,
          productosConBajoStock: productos.filter(p => p.stock > 0 && p.stock <= 50).length,
          usuariosPendientes: usuarios.filter(u => !u.activo).length
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        success: false,
        error: error.message,
        data: {}
      };
    }
  }

  /**
   * Obtiene productos recientes (últimos N)
   * @param {number} limit - Cantidad de productos a retornar
   * @returns {Promise}
   */
  async getProductosRecientes(limit = 5) {
    try {
      const data = await this._fetchData(`${this.baseUrl}/productos.json`);
      const productos = data.data || [];
      
      // Ordena por fecha de actualización descendente
      const productosOrdenados = productos
        .sort((a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion))
        .slice(0, limit);

      return {
        success: true,
        data: productosOrdenados,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener productos recientes:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Obtiene usuarios recientes (últimos N)
   * @param {number} limit - Cantidad de usuarios a retornar
   * @returns {Promise}
   */
  async getUsuariosRecientes(limit = 5) {
    try {
      const data = await this._fetchData(`${this.baseUrl}/usuarios.json`);
      const usuarios = data.data || [];
      
      // Ordena por fecha de actualización descendente
      const usuariosOrdenados = usuarios
        .sort((a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion))
        .slice(0, limit);

      return {
        success: true,
        data: usuariosOrdenados,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al obtener usuarios recientes:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Simula la creación de un producto
   * @param {Object} producto - Datos del producto
   * @returns {Promise}
   */
  async crearProducto(producto) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 10000),
            ...producto,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
          },
          message: 'Producto creado exitosamente',
          timestamp: new Date().toISOString()
        });
      }, this.timeout);
    });
  }

  /**
   * Simula la actualización de un producto
   * @param {number} id - ID del producto
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise}
   */
  async actualizarProducto(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id,
            ...updates,
            fechaActualizacion: new Date().toISOString()
          },
          message: 'Producto actualizado exitosamente',
          timestamp: new Date().toISOString()
        });
      }, this.timeout);
    });
  }

  /**
   * Simula la eliminación de un producto
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  async eliminarProducto(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Producto ${id} eliminado exitosamente`,
          timestamp: new Date().toISOString()
        });
      }, this.timeout);
    });
  }

  /**
   * Simula la creación de un usuario
   * @param {Object} usuario - Datos del usuario
   * @returns {Promise}
   */
  async crearUsuario(usuario) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 10000),
            ...usuario,
            fechaRegistro: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            ultimoLogin: null
          },
          message: 'Usuario creado exitosamente',
          timestamp: new Date().toISOString()
        });
      }, this.timeout);
    });
  }

  /**
   * Simula la actualización de un usuario
   * @param {number} id - ID del usuario
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise}
   */
  async actualizarUsuario(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id,
            ...updates,
            fechaActualizacion: new Date().toISOString()
          },
          message: 'Usuario actualizado exitosamente',
          timestamp: new Date().toISOString()
        });
      }, this.timeout);
    });
  }

  /**
   * Simula la eliminación de un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise}
   */
  async eliminarUsuario(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Usuario ${id} eliminado exitosamente`,
          timestamp: new Date().toISOString()
        });
      }, this.timeout);
    });
  }
}

// Exportar la clase para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIClient;
}


/*
========================================
Probando la API Productos
========================================
*/ 

/**
 * Sistema de Administración de Productos
 * Controla el CRUD de productos usando la API Mock
 */

const api = new APIClient();
let currentProducts = [];
let editingProductId = null;

// ===========================================
// FUNCIONES DE NAVEGACIÓN ENTRE TABS
// ===========================================

/**
 * Cambia entre las diferentes pestañas/vistas
 */
function switchTab(tabName) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remover active de todos los tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar la página seleccionada
    const selectedPage = document.getElementById(tabName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Activar el tab correspondiente
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(tabName)) {
            tab.classList.add('active');
        }
    });
    
    // Cargar datos según la vista
    if (tabName === 'catalog') {
        loadCatalog();
    } else if (tabName === 'admin') {
        loadAdminProducts();
    }
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================================
// FUNCIONES DEL CATÁLOGO
// ===========================================

/**
 * Carga y muestra todos los productos en el catálogo
 */
async function loadCatalog() {
    const container = document.getElementById('productsList');
    container.innerHTML = '<div class="loading">🌱 Cargando productos...</div>';
    
    try {
        const response = await api.getProductos();
        
        if (!response.success) {
            throw new Error(response.error || 'Error al cargar productos');
        }
        
        currentProducts = response.data;
        renderCatalog(currentProducts);
        
    } catch (error) {
        console.error('Error al cargar catálogo:', error);
        container.innerHTML = `
            <div class="error-message">
                ❌ Error al cargar productos: ${error.message}
                <button class="btn" onclick="loadCatalog()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Renderiza el catálogo de productos
 */
function renderCatalog(productos) {
    const container = document.getElementById('productsList');
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<div class="empty-message">No hay productos disponibles</div>';
        return;
    }
    
    container.innerHTML = productos.map(producto => {
        const stockClass = producto.stock === 0 ? 'stock-agotado' : 
                          producto.stock <= 10 ? 'stock-bajo' : 'stock-disponible';
        
        return `
            <div class="product-card">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img">
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <p class="product-category">${producto.categoria}</p>
                    <p class="product-price">$${producto.precio.toLocaleString('es-CL')}</p>
                    <span class="product-stock ${stockClass}">
                        Stock: ${producto.stock}
                    </span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-detail" onclick="viewDetail(${producto.id})">
                        👁️ Ver Detalle
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Muestra el detalle de un producto específico
 */
async function viewDetail(productId) {
    const container = document.getElementById('productDetail');
    container.innerHTML = '<div class="loading">Cargando detalle...</div>';
    
    // Cambiar a la vista de detalle
    document.getElementById('catalog').classList.remove('active');
    document.getElementById('detail').classList.add('active');
    
    try {
        const response = await api.getProductoById(productId);
        
        if (!response.success) {
            throw new Error(response.error || 'Producto no encontrado');
        }
        
        const producto = response.data;
        renderDetail(producto);
        
    } catch (error) {
        console.error('Error al cargar detalle:', error);
        container.innerHTML = `
            <div class="error-message">
                ❌ Error: ${error.message}
                <button class="btn" onclick="switchTab('catalog')">Volver</button>
            </div>
        `;
    }
}

/**
 * Renderiza el detalle completo de un producto
 */
function renderDetail(producto) {
    const container = document.getElementById('productDetail');
    
    const stockClass = producto.stock === 0 ? 'stock-agotado' : 
                      producto.stock <= 10 ? 'stock-bajo' : 'stock-disponible';
    
    container.innerHTML = `
        <div class="detail-container">
            <div class="detail-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="detail-content">
                <h2>${producto.nombre}</h2>
                <p class="detail-category">📦 ${producto.categoria}</p>
                <p class="detail-price">💰 $${producto.precio.toLocaleString('es-CL')}</p>
                <p class="detail-stock ${stockClass}">
                    📊 Stock: ${producto.stock} unidades
                </p>
                <div class="detail-description">
                    <h3>Descripción</h3>
                    <p>${producto.descripcion}</p>
                </div>
                ${producto.caracteristicas ? `
                    <div class="detail-features">
                        <h3>Características</h3>
                        <p>✨ ${producto.caracteristicas}</p>
                    </div>
                ` : ''}
                <div class="detail-meta">
                    <p><strong>ID:</strong> ${producto.id}</p>
                    <p><strong>Activo:</strong> ${producto.activo ? '✅ Sí' : '❌ No'}</p>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-edit" onclick="editProduct(${producto.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-delete" onclick="confirmDelete(${producto.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===========================================
// FUNCIONES DE ADMINISTRACIÓN
// ===========================================

/**
 * Carga la lista de productos en la vista de administración
 */
async function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    container.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    try {
        const response = await api.getProductos();
        
        if (!response.success) {
            throw new Error(response.error);
        }
        
        currentProducts = response.data;
        renderAdminProducts(currentProducts);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        container.innerHTML = `<div class="error-message">❌ ${error.message}</div>`;
    }
}

/**
 * Renderiza la lista de productos en modo administración
 */
function renderAdminProducts(productos) {
    const container = document.getElementById('adminProductsList');
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<div class="empty-message">No hay productos guardados</div>';
        return;
    }
    
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.nombre}</td>
                        <td>${p.categoria}</td>
                        <td>$${p.precio.toLocaleString('es-CL')}</td>
                        <td>${p.stock}</td>
                        <td class="actions">
                            <button class="btn-small btn-edit" onclick="editProduct(${p.id})" title="Editar">
                                ✏️
                            </button>
                            <button class="btn-small btn-delete" onclick="confirmDelete(${p.id})" title="Eliminar">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Agrega un nuevo producto o actualiza uno existente
 */
async function addProduct() {
    // Obtener valores del formulario
    const nombre = document.getElementById('productName').value.trim();
    const precio = parseFloat(document.getElementById('productPrice').value);
    const categoria = document.getElementById('productCategory').value;
    const imagen = document.getElementById('productImage').value.trim();
    const descripcion = document.getElementById('productDescription').value.trim();
    const caracteristicas = document.getElementById('productCustom').value.trim();
    
    // Validaciones
    if (!nombre) {
        alert('⚠️ Por favor ingresa el nombre del producto');
        return;
    }
    
    if (!precio || precio <= 0) {
        alert('⚠️ Por favor ingresa un precio válido');
        return;
    }
    
    if (!descripcion) {
        alert('⚠️ Por favor ingresa una descripción');
        return;
    }
    
    // Crear objeto producto
    const producto = {
        nombre,
        precio,
        categoria,
        imagen: imagen || '../components/img/default.webp',
        descripcion,
        caracteristicas,
        stock: 100, // Stock por defecto
        activo: true
    };
    
    try {
        let response;
        
        if (editingProductId) {
            // Actualizar producto existente
            response = await api.actualizarProducto(editingProductId, producto);
            alert('✅ Producto actualizado exitosamente');
        } else {
            // Crear nuevo producto
            response = await api.crearProducto(producto);
            alert('✅ Producto agregado exitosamente');
        }
        
        if (response.success) {
            // Limpiar formulario
            clearForm();
            // Recargar lista
            loadAdminProducts();
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('❌ Error al guardar el producto: ' + error.message);
    }
}

/**
 * Prepara el formulario para editar un producto
 */
async function editProduct(productId) {
    // Cambiar a la vista de administración
    switchTab('admin');
    
    try {
        const response = await api.getProductoById(productId);
        
        if (!response.success) {
            throw new Error(response.error);
        }
        
        const producto = response.data;
        
        // Llenar el formulario con los datos del producto
        document.getElementById('productName').value = producto.nombre;
        document.getElementById('productPrice').value = producto.precio;
        document.getElementById('productCategory').value = producto.categoria;
        document.getElementById('productImage').value = producto.imagen;
        document.getElementById('productDescription').value = producto.descripcion;
        document.getElementById('productCustom').value = producto.caracteristicas || '';
        
        // Guardar el ID del producto que se está editando
        editingProductId = productId;
        
        // Cambiar el texto del botón
        const btn = document.querySelector('.admin-form .btn');
        btn.textContent = '💾 Actualizar Producto';
        btn.style.backgroundColor = '#f39c12';
        
        // Agregar botón de cancelar
        if (!document.getElementById('cancelEditBtn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancelEditBtn';
            cancelBtn.className = 'btn';
            cancelBtn.textContent = '❌ Cancelar Edición';
            cancelBtn.style.backgroundColor = '#95a5a6';
            cancelBtn.style.marginLeft = '10px';
            cancelBtn.onclick = clearForm;
            btn.parentNode.appendChild(cancelBtn);
        }
        
        // Scroll al formulario
        document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al cargar producto para editar:', error);
        alert('❌ Error al cargar el producto: ' + error.message);
    }
}

/**
 * Confirma y elimina un producto
 */
function confirmDelete(productId) {
    if (confirm('⚠️ ¿Estás seguro de que deseas eliminar este producto?\nEsta acción no se puede deshacer.')) {
        deleteProduct(productId);
    }
}

/**
 * Elimina un producto
 */
async function deleteProduct(productId) {
    try {
        const response = await api.eliminarProducto(productId);
        
        if (response.success) {
            alert('✅ Producto eliminado exitosamente');
            // Recargar listas
            loadAdminProducts();
            loadCatalog();
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('❌ Error al eliminar el producto: ' + error.message);
    }
}

/**
 * Limpia el formulario de administración
 */
function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = 'Frutas';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCustom').value = '';
    
    // Resetear modo edición
    editingProductId = null;
    
    // Restaurar botón
    const btn = document.querySelector('.admin-form .btn');
    btn.textContent = 'Agregar Producto';
    btn.style.backgroundColor = '';
    
    // Eliminar botón de cancelar si existe
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
}

// ===========================================
// INICIALIZACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar catálogo inicial
    loadCatalog();
    
    // Agregar tabs de navegación si no existen
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer && tabsContainer.children.length === 1) {
        tabsContainer.innerHTML = `
            <button class="tab active" onclick="switchTab('catalog')">Catálogo</button>
        `;
    }
});