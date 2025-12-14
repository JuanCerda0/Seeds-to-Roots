import { carrito as carritoApi } from './api';

const carritoService = {
  async get(usuarioId) {
    const response = await carritoApi.get(usuarioId);
    return response.data;
  },

  async add(usuarioId, payload) {
    const response = await carritoApi.add(usuarioId, payload);
    return response.data;
  },

  async update(usuarioId, payload) {
    const response = await carritoApi.update(usuarioId, payload);
    return response.data;
  },

  async remove(usuarioId, productoId) {
    const response = await carritoApi.remove(usuarioId, productoId);
    return response.data;
  },

  async clear(usuarioId) {
    await carritoApi.clear(usuarioId);
  },
};

export default carritoService;
