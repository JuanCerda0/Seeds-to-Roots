    /**
 * Dashboard Script
 * Controla la lógica del dashboard de administrador
 */

class Dashboard {
  constructor() {
    this.api = new APIClient();
    this.init();
  }

  /**
   * Inicializa el dashboard al cargar la página
   */
  async init() {
    try {
      await this.cargarEstadisticas();
      await this.cargarProductos();
      await this.cargarUsuarios();
      this.setupEventListeners();
      console.log('Dashboard cargado exitosamente');
    } catch (error) {
      console.error('Error al inicializar el dashboard:', error);
      this.mostrarError('Error al cargar el dashboard');
    }
  }

  /**
   * Carga y muestra las estadísticas en las tarjetas
   */
  async cargarEstadisticas() {
    try {
      const response = await this.api.getEstadisticas();
      
      if (!response.success) {
        throw new Error('No se pudieron cargar las estadísticas');
      }

      const stats = response.data;

      // Actualizar tarjetas de estadísticas
      document.getElementById('stat-productos').textContent = stats.totalProductos;
      document.getElementById('stat-usuarios').textContent = stats.totalUsuarios;
      document.getElementById('stat-pedidos').textContent = (stats.totalProductos * 2); // Simulado

      console.log('Estadísticas cargadas:', stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  /**
   * Carga y muestra los productos recientes en la tabla
   */
  async cargarProductos() {
    try {
      const response = await this.api.getProductosRecientes(5);
      
      if (!response.success) {
        throw new Error('No se pudieron cargar los productos');
      }

      const productos = response.data;
      const tbody = document.getElementById('productos-tbody');
      tbody.innerHTML = ''; // Limpiar tabla

      if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay productos</td></tr>';
        return;
      }

      productos.forEach(producto => {
        const row = document.createElement('tr');
        const statusClass = this.getStatusClass(producto.stock);
        const statusText = this.getStatusText(producto.stock);

        row.innerHTML = `
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td>$${producto.precio.toFixed(2)}</td>
          <td><span class="badge ${statusClass}">${statusText}</span></td>
        `;

        tbody.appendChild(row);
      });

      console.log('Productos cargados:', productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  /**
   * Carga y muestra los usuarios recientes en la tabla
   */
  async cargarUsuarios() {
    try {
      const response = await this.api.getUsuariosRecientes(5);
      
      if (!response.success) {
        throw new Error('No se pudieron cargar los usuarios');
      }

      const usuarios = response.data;
      const tbody = document.getElementById('usuarios-tbody');
      tbody.innerHTML = ''; // Limpiar tabla

      if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios</td></tr>';
        return;
      }

      usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        const statusClass = usuario.estado === 'activo' ? 'badge-success' : 'badge-warning';
        const statusText = usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1);

        row.innerHTML = `
          <td>${usuario.id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.email}</td>
          <td><span class="badge ${statusClass}">${statusText}</span></td>
          <td>${usuario.fechaRegistro}</td>
        `;

        tbody.appendChild(row);
      });

      console.log('Usuarios cargados:', usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  /**
   * Determina la clase CSS del estado de stock
   * @param {number} stock - Cantidad de stock
   * @returns {string} Clase CSS del badge
   */
  getStatusClass(stock) {
    if (stock === 0) return 'badge-danger';
    if (stock <= 50) return 'badge-warning';
    return 'badge-success';
  }

  /**
   * Obtiene el texto del estado de stock
   * @param {number} stock - Cantidad de stock
   * @returns {string} Texto del estado
   */
  getStatusText(stock) {
    if (stock === 0) return 'Sin Stock';
    if (stock <= 50) return 'Bajo Stock';
    return 'En Stock';
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Recargar datos cada 30 segundos (opcional)
    setInterval(() => {
      this.cargarEstadisticas();
      this.cargarProductos();
      this.cargarUsuarios();
    }, 30000);

    // Botones "Ver todos"
    const btnVerProductos = document.getElementById('btn-ver-productos');
    const btnVerUsuarios = document.getElementById('btn-ver-usuarios');

    if (btnVerProductos) {
      btnVerProductos.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirigir a página de productos completa
        window.location.href = 'products.html';
      });
    }

    if (btnVerUsuarios) {
      btnVerUsuarios.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirigir a página de usuarios completa
        window.location.href = 'users.html';
      });
    }
  }

  /**
   * Muestra un mensaje de error
   * @param {string} mensaje - Mensaje a mostrar
   */
  mostrarError(mensaje) {
    console.error(mensaje);
    // Aquí puedes agregar una notificación visual si lo deseas
  }

  /**
   * Recarga todos los datos del dashboard
   */
  async recargar() {
    console.log('Recargando dashboard...');
    await this.cargarEstadisticas();
    await this.cargarProductos();
    await this.cargarUsuarios();
  }
}

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
});
