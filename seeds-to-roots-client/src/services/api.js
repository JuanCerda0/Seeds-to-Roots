import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== AUTH ====================
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

// ==================== PRODUCTOS ====================
export const productos = {
  getAll: () => api.get('/api/productos'),
  getById: (id) => api.get(`/api/productos/${id}`),
  getRecientes: (limit = 5) => api.get(`/api/productos/recientes?limit=${limit}`),
  create: (data) => api.post('/api/productos', data),
  update: (id, data) => api.put(`/api/productos/${id}`, data),
  delete: (id) => api.delete(`/api/productos/${id}`),
};

// ==================== USUARIOS ====================
export const usuarios = {
  getAll: () => api.get('/api/usuarios'),
  getById: (id) => api.get(`/api/usuarios/${id}`),
  getByEmail: (email) => api.get(`/api/usuarios/email/${email}`),
  update: (id, data) => api.put(`/api/usuarios/${id}`, data),
  delete: (id) => api.delete(`/api/usuarios/${id}`),
};

// ==================== CARRITO ====================
export const carrito = {
  get: (usuarioId) => api.get(`/api/carrito/${usuarioId}`),
  add: (usuarioId, item) => api.post(`/api/carrito/${usuarioId}/add`, item),
  update: (usuarioId, item) => api.put(`/api/carrito/${usuarioId}/update`, item),
  remove: (usuarioId, productoId) => api.delete(`/api/carrito/${usuarioId}/remove/${productoId}`),
  clear: (usuarioId) => api.delete(`/api/carrito/${usuarioId}/clear`),
};

// ==================== ESTADÍSTICAS ====================
export const estadisticas = {
  get: () => api.get('/api/estadisticas'),
};

export default api;