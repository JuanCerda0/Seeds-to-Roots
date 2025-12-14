import api from './api';

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

  /**
   * Obtener usuario actual
   * @returns {Object|null}
   */
  getCurrentUser() {
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
    const user = this.getCurrentUser();
    return user?.rol === 'ADMIN';
  },
};

export default authService;
