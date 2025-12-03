/**
 * Products Controller
 * Controla la lógica de la página de productos
 */

class ProductsController {
  constructor() {
    // Asegurar que APIClient esté disponible
    if (typeof APIClient === 'undefined') {
      console.error('APIClient no está cargado. Incluye APIClient.js antes de este script.');
      return;
    }
    
    this.api = new APIClient();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.allProducts = [];
    this.filteredProducts = [];
    this.editingProductId = null;
    this.init();
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    try {
      await this.cargarProductos();
      this.setupEventListeners();
      this.setupFilterListeners();
      console.log('Products Controller cargado exitosamente');
    } catch (error) {
      console.error('Error al inicializar Products Controller:', error);
    }
  }

  /**
   * Carga todos los productos
   */
  async cargarProductos() {
    try {
      const response = await this.api.getProductos({ limit: 1000 });

      if (!response.success) {
        throw new Error(response.error || 'No se pudieron cargar los productos');
      }

      // Normalizar respuesta - puede venir como array directo o en response.data
      this.allProducts = Array.isArray(response.data) ? response.data : (response.data.data || []);
      this.filteredProducts = [...this.allProducts];
      this.currentPage = 1;
      this.mostrarProductos();
      this.actualizarContador();
      console.log('Productos cargados:', this.allProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar los productos');
    }
  }

  /**
   * Muestra los productos en la tabla con paginación
   */
  mostrarProductos() {
    const tbody = document.getElementById('productos-tbody');
    tbody.innerHTML = '';

    if (this.filteredProducts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay productos</td></tr>';
      this.actualizarPaginacion();
      return;
    }

    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    const productosEnPagina = this.filteredProducts.slice(inicio, fin);

    productosEnPagina.forEach(producto => {
      const row = document.createElement('tr');
      const statusClass = this.getStatusClass(producto.stock);
      const statusText = this.getStatusText(producto.stock);

      row.innerHTML = `
        <td>${producto.id}</td>
        <td><strong>${producto.sku}</strong></td>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>$${producto.precio.toFixed(2)}</td>
        <td>${producto.stock}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="product-actions">
            <button class="btn-edit btn-small" data-id="${producto.id}" onclick="window.productsController.abrirFormulario(${producto.id})">
              ✏️ Editar
            </button>
            <button class="btn-delete btn-small" data-id="${producto.id}" onclick="window.productsController.eliminarProducto(${producto.id})">
              🗑️ Eliminar
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });

    this.actualizarPaginacion();
  }

  /**
   * Actualiza el contador de productos
   */
  actualizarContador() {
    const contador = document.getElementById('product-count');
    if (contador) {
      contador.textContent = `${this.filteredProducts.length} producto${this.filteredProducts.length !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Actualiza los botones de paginación
   */
  actualizarPaginacion() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const paginationInfo = document.getElementById('pagination-info');

    if (totalPages === 0) {
      btnPrev.disabled = true;
      btnNext.disabled = true;
      paginationInfo.textContent = 'Sin datos';
      return;
    }

    btnPrev.disabled = this.currentPage === 1;
    btnNext.disabled = this.currentPage === totalPages;
    paginationInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    const btnCrearProducto = document.getElementById('btn-crear-producto');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnCrearProducto) {
      btnCrearProducto.addEventListener('click', () => {
        this.abrirFormulario(null);
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.mostrarProductos();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.mostrarProductos();
        }
      });
    }
  }

  /**
   * Configura los filtros
   */
  setupFilterListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const stockFilter = document.getElementById('stock-filter');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.aplicarFiltros());
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.aplicarFiltros());
    }

    if (stockFilter) {
      stockFilter.addEventListener('change', () => this.aplicarFiltros());
    }
  }

  /**
   * Aplica todos los filtros
   */
  aplicarFiltros() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;
    const stockValue = document.getElementById('stock-filter').value;

    this.filteredProducts = this.allProducts.filter(producto => {
      // Filtro de búsqueda
      const matchBusqueda = 
        producto.nombre.toLowerCase().includes(searchValue) ||
        producto.sku.toLowerCase().includes(searchValue);

      if (!matchBusqueda) return false;

      // Filtro de categoría
      if (categoryValue && producto.categoria !== categoryValue) {
        return false;
      }

      // Filtro de stock
      if (stockValue) {
        if (stockValue === 'en-stock' && producto.stock === 0) return false;
        if (stockValue === 'bajo-stock' && (producto.stock === 0 || producto.stock > 50)) return false;
        if (stockValue === 'sin-stock' && producto.stock !== 0) return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.mostrarProductos();
    this.actualizarContador();
  }

  /**
   * Abre el formulario para crear o editar
   */
  abrirFormulario(productId) {
    this.editingProductId = productId;

    if (productId) {
      // Editar producto
      const producto = this.allProducts.find(p => p.id === productId);
      if (producto) {
        window.location.href = `product-form.html?id=${productId}`;
      }
    } else {
      // Crear nuevo
      window.location.href = 'product-form.html';
    }
  }

  /**
   * Elimina un producto
   */
  async eliminarProducto(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const response = await this.api.eliminarProducto(productId);

        if (response.success) {
          alert('Producto eliminado exitosamente');
          await this.cargarProductos();
        } else {
          alert(response.error || 'Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
      }
    }
  }

  /**
   * Determina la clase CSS del estado de stock
   */
  getStatusClass(stock) {
    if (stock === 0) return 'badge-danger';
    if (stock <= 50) return 'badge-warning';
    return 'badge-success';
  }

  /**
   * Obtiene el texto del estado de stock
   */
  getStatusText(stock) {
    if (stock === 0) return 'Sin Stock';
    if (stock <= 50) return 'Bajo Stock';
    return 'En Stock';
  }
}

// Inicializar controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.productsController = new ProductsController();
});
