import api from './api';

const productoService = {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await api.get('/api/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await api.get(`/api/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  /**
   * Obtener productos recientes
   * @param {number} limit - Número de productos a retornar
   * @returns {Promise<Array>}
   */
  async getRecientes(limit = 5) {
    try {
      const response = await api.get(`/api/productos/recientes?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos recientes:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto (solo ADMIN)
   * @param {Object} producto
   * @returns {Promise<Object>}
   */
  async create(producto) {
    try {
      const response = await api.post('/api/productos', producto);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto (solo ADMIN)
   * @param {number} id
   * @param {Object} producto
   * @returns {Promise<Object>}
   */
  async update(id, producto) {
    try {
      const response = await api.put(`/api/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto (solo ADMIN)
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await api.delete(`/api/productos/${id}`);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Buscar productos por nombre o categoría (filtrado en cliente)
   * @param {string} termino
   * @returns {Promise<Array>}
   */
  async buscar(termino) {
    try {
      const productos = await this.getAll();
      const terminoLower = termino.toLowerCase();
      return productos.filter(p =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.categoria?.toLowerCase().includes(terminoLower)
      );
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por categoría (filtrado en cliente)
   * @param {string} categoria
   * @returns {Promise<Array>}
   */
  async getByCategoria(categoria) {
    try {
      const productos = await this.getAll();
      return productos.filter(p => p.categoria === categoria);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  },
};

export default productoService;