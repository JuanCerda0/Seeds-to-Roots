// Configuración de la API
const API_URL = 'http://localhost:8080/';

// Clase para manejar todas las peticiones
class API {
  constructor() {
    this.baseURL = API_URL;
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token si existe
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
        window.location.href = '/admin/pages/login.html';
        throw new Error('Sesión expirada');
      }

      // Manejar errores HTTP
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Si es 204 (No Content), no hay body
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error en request:', error);
      throw error;
    }
  }

  // ============ AUTENTICACIÓN ============
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardar token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/pages/login.html';
  }

  // ============ PRODUCTOS ============
  async getProductos() {
    return await this.request('/api/productos');
  }

  async getProducto(id) {
    return await this.request(`/api/productos/${id}`);
  }

  async getProductosRecientes(limit = 5) {
    return await this.request(`/api/productos/recientes?limit=${limit}`);
  }

  async crearProducto(producto) {
    return await this.request('/api/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  async actualizarProducto(id, producto) {
    return await this.request(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
  }

  async eliminarProducto(id) {
    return await this.request(`/api/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ USUARIOS ============
  async getUsuarios() {
    return await this.request('/api/usuarios');
  }

  async getUsuario(id) {
    return await this.request(`/api/usuarios/${id}`);
  }

  async actualizarUsuario(id, usuario) {
    return await this.request(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  }

  async eliminarUsuario(id) {
    return await this.request(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ ESTADÍSTICAS ============
  async getEstadisticas() {
    return await this.request('/api/estadisticas');
  }
}

// Crear instancia global
const api = new API();