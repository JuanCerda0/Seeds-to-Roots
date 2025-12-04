import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import styles from '../components/css/log-in.module.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log('Login exitoso:', response);
      
      // Redirigir según el rol
      if (response.rol === 'admin' || response.rol === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Credenciales incorrectas. Por favor, intenta de nuevo.';
      setError(errorMessage);
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authFormSection}>
        <h2 className={styles.authTitle}>🌿 Iniciar Sesión</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className={styles.formInput}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.btnSubmit}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>¿No tienes cuenta? <a href="/register" className={styles.linkRegister}>Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;