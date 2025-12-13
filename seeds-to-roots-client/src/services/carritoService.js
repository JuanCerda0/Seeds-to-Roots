import api from './api';

const carritoService = {
  /**
   * Obtener carrito del usuario
   * @param {number} usuarioId
   * @returns {Promise<Object>}
   */
  async getCarrito(usuarioId) {
    try {
      const response = await api.get(`/api/carrito/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      throw error;
    }
  },

  /**
   * Agregar producto al carrito
   * @param {number} usuarioId
   * @param {number} productoId
   * @param {number} cantidad
   * @returns {Promise<Object>}
   */
  async agregarProducto(usuarioId, productoId, cantidad) {
    try {
      const response = await api.post(`/api/carrito/${usuarioId}/add`, {
        productoId,
        cantidad
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  },

  /**
   * Actualizar cantidad de producto en carrito
   * @param {number} usuarioId
   * @param {number} productoId
   * @param {number} cantidad
   * @returns {Promise<Object>}
   */
  async actualizarCantidad(usuarioId, productoId, cantidad) {
    try {
      const response = await api.put(`/api/carrito/${usuarioId}/update`, {
        productoId,
        cantidad
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  },

  /**
   * Eliminar producto del carrito
   * @param {number} usuarioId
   * @param {number} productoId
   * @returns {Promise<Object>}
   */
  async eliminarProducto(usuarioId, productoId) {
    try {
      const response = await api.delete(`/api/carrito/${usuarioId}/remove/${productoId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      throw error;
    }
  },

  /**
   * Limpiar carrito completo
   * @param {number} usuarioId
   * @returns {Promise<void>}
   */
  async limpiarCarrito(usuarioId) {
    try {
      await api.delete(`/api/carrito/${usuarioId}/clear`);
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      throw error;
    }
  },
};

export default carritoService;