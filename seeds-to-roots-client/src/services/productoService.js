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
};

export default productoService;