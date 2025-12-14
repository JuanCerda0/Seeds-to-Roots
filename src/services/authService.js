import api from './api';

const decodeTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('No se pudo decodificar el token', error);
    return null;
  }
};

const notifyAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-change'));
  }
};

const authService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { token, email, rol, id }
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, email, rol, id } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email, rol, id }));
      notifyAuthChange();
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del formulario de registro
   * @returns {Promise<Object>} - { token, email, rol, id }
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, email, rol, id } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email, rol, id }));
      notifyAuthChange();
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notifyAuthChange();
    window.location.href = '/login';
    // Si no sirve lo cambio a GlobalThis.location.href = '/login';
  },

  getTokenPayload() {
    return decodeTokenPayload();
  },

  getUserIdFromToken() {
    const payload = decodeTokenPayload();
    if (!payload) return null;
    return (
      payload.id ??
      payload.userId ??
      (payload.sub ? Number(payload.sub) : null)
    );
  },

  /**
   * Obtener usuario actual
   * @returns {Object|null}
   */
  getCurrentUser() {
    const payload = decodeTokenPayload();
    if (payload) {
      return {
        id:
          payload.id ??
          payload.userId ??
          (payload.sub ? Number(payload.sub) : null),
        email: payload.email || payload.username || payload.sub || null,
        rol:
          payload.rol ||
          payload.role ||
          payload.authorities?.[0] ||
          payload.authority ||
          null,
      };
    }
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Verificar si el usuario es admin
   * @returns {boolean}
   */
  isAdmin() {
    const payload = decodeTokenPayload();
    if (payload) {
      const role =
        payload.rol ||
        payload.role ||
        payload.authorities?.[0] ||
        payload.authority;
      return role?.toUpperCase() === 'ADMIN';
    }
    const user = this.getCurrentUser();
    return user?.rol === 'ADMIN';
  },
};

export default authService;
