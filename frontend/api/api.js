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