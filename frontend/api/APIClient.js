/**
 * APIClient - Cliente de API para el admin
 * Proporciona métodos para comunicarse con el backend
 */

class APIClient {
  constructor() {
    // Usar la URL del backend desde variables de entorno o localhost
    this.baseURL = window.API_URL || 'http://localhost:8080';
  }

  /**
   * Obtener token del localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Método genérico para hacer requests HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token JWT si existe
    const token = this.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Manejar 401 (no autorizado)
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
        throw new Error('Sesión expirada');
      }

      // Si es 204 (No Content), no hay body
      if (response.status === 204) {
        return { success: true, data: null };
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Manejar errores HTTP
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${typeof data === 'string' ? data : data.message || 'Error'}`);
      }

      // Normalizar respuesta
      if (typeof data === 'object' && data !== null) {
        return { success: true, data: data };
      }

      return { success: true, data: data };
    } catch (error) {
      console.error('Error en request:', error);
      return { success: false, error: error.message };
    }
  }

  // ============ AUTENTICACIÓN ============

  /**
   * Login
   */
  async login(email, password) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  }

  /**
   * Register
   */
  async register(userData) {
    const result = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (result.success && result.data) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  // ============ PRODUCTOS ============

  /**
   * Obtener todos los productos
   */
  async getProductos(params = {}) {
    let endpoint = '/api/productos';
    
    if (params.limit) {
      endpoint += `?limit=${params.limit}`;
    }

    return await this.request(endpoint);
  }

  /**
   * Obtener un producto por ID
   */
  async getProducto(id) {
    return await this.request(`/api/productos/${id}`);
  }

  /**
   * Obtener productos recientes
   */
  async getProductosRecientes(limit = 5) {
    return await this.request(`/api/productos/recientes?limit=${limit}`);
  }

  /**
   * Crear un nuevo producto
   */
  async crearProducto(producto) {
    return await this.request('/api/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  /**
   * Actualizar un producto
   */
  async actualizarProducto(id, producto) {
    return await this.request(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
  }

  /**
   * Eliminar un producto
   */
  async eliminarProducto(id) {
    return await this.request(`/api/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ USUARIOS ============

  /**
   * Obtener todos los usuarios
   */
  async getUsuarios(params = {}) {
    let endpoint = '/api/usuarios';
    
    if (params.limit) {
      endpoint += `?limit=${params.limit}`;
    }

    return await this.request(endpoint);
  }

  /**
   * Obtener un usuario por ID
   */
  async getUsuario(id) {
    return await this.request(`/api/usuarios/${id}`);
  }

  /**
   * Crear un nuevo usuario
   */
  async crearUsuario(usuario) {
    return await this.request('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  }

  /**
   * Actualizar un usuario
   */
  async actualizarUsuario(id, usuario) {
    return await this.request(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  }

  /**
   * Eliminar un usuario
   */
  async eliminarUsuario(id) {
    return await this.request(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ CARRITOS ============

  /**
   * Obtener todos los carritos
   */
  async getCarritos() {
    return await this.request('/api/carritos');
  }

  /**
   * Obtener un carrito por ID
   */
  async getCarrito(id) {
    return await this.request(`/api/carritos/${id}`);
  }

  // ============ ESTADÍSTICAS ============

  /**
   * Obtener estadísticas generales
   */
  async getEstadisticas() {
    return await this.request('/api/estadisticas');
  }
}
