import api from './api';

const userService = {
  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await api.get('/api/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await api.get(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario (solo ADMIN)
   * @param {Object} usuario
   * @returns {Promise<Object>}
   */
  async create(usuario) {
    try {
      const response = await api.post('/api/usuarios', usuario);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario (solo ADMIN)
   * @param {number} id
   * @param {Object} usuario
   * @returns {Promise<Object>}
   */
  async update(id, usuario) {
    try {
      const response = await api.put(`/api/usuarios/${id}`, usuario);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario (solo ADMIN)
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await api.delete(`/api/usuarios/${id}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  /**
   * Buscar usuarios por nombre o email (filtrado en cliente)
   * @param {string} termino
   * @returns {Promise<Array>}
   */
  async buscar(termino) {
    try {
      const usuarios = await this.getAll();
      const terminoLower = termino.toLowerCase();
      return usuarios.filter(u =>
        u.nombre.toLowerCase().includes(terminoLower) ||
        u.email.toLowerCase().includes(terminoLower) ||
        u.run.includes(termino)
      );
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  },
};

export default userService;
