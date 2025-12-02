import CONFIG from './config.js';

class API {
  constructor() {
    this.baseURL = CONFIG.API_URL;
    this.token = localStorage.getItem('token');
  }

  // Método helper para hacer requests
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
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Si es 401, redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login.html';
        return;
      }

      // Si no es OK, lanzar error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Si es DELETE sin contenido
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // AUTH
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login.html';
  }

  // PRODUCTOS
  async getProductos() {
    return await this.request('/api/productos');
  }

  async getProducto(id) {
    return await this.request(`/api/productos/${id}`);
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

  // USUARIOS (solo ADMIN)
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

  // ESTADÍSTICAS
  async getEstadisticas() {
    return await this.request('/api/estadisticas');
  }

  // CARRITO
  async getCarrito(usuarioId) {
    return await this.request(`/api/carrito/${usuarioId}`);
  }

  async agregarAlCarrito(usuarioId, productoId, cantidad) {
    return await this.request(`/api/carrito/${usuarioId}/add`, {
      method: 'POST',
      body: JSON.stringify({ productoId, cantidad }),
    });
  }

  async actualizarCarrito(usuarioId, productoId, cantidad) {
    return await this.request(`/api/carrito/${usuarioId}/update`, {
      method: 'PUT',
      body: JSON.stringify({ productoId, cantidad }),
    });
  }

  async eliminarDelCarrito(usuarioId, productoId) {
    return await this.request(`/api/carrito/${usuarioId}/remove/${productoId}`, {
      method: 'DELETE',
    });
  }

  async limpiarCarrito(usuarioId) {
    return await this.request(`/api/carrito/${usuarioId}/clear`, {
      method: 'DELETE',
    });
  }
}

// Exportar instancia única
const api = new API();
export default api;