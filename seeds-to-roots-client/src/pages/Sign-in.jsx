import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import styles from '../components/css/sign-in.module.css';

function SignIn() {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    ciudad: '',
    fechaNacimiento: '',
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
      const response = await authService.register(formData);
      console.log('Registro exitoso:', response);
      
      // Redirigir al home después del registro
      navigate('/');
    } catch (err) {
      setError('Error al registrar. Por favor, verifica los datos.');
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.authBg}></div>
      
      <div className={styles.signInFormSection}>
        <h2 className={styles.authTitle}>🌱 Crear Cuenta</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {/* Información Personal */}
          <fieldset className={styles.formFieldset}>
            <legend>Información Personal</legend>
            
            <div className={styles.formGroup}>
              <label htmlFor="run">
                RUN <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="run"
                name="run"
                placeholder="12.345.678-9"
                value={formData.run}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombre">
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellidos">
                Apellidos <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Tus apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fechaNacimiento">
                Fecha de Nacimiento <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </fieldset>

          {/* Información de Contacto */}
          <fieldset className={styles.formFieldset}>
            <legend>Información de Contacto</legend>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono">
                Teléfono <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </fieldset>

          {/* Información de Dirección */}
          <fieldset className={styles.formFieldset}>
            <legend>Dirección</legend>
            
            <div className={styles.formGroup}>
              <label htmlFor="direccion">
                Dirección <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Calle Principal #123"
                value={formData.direccion}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="region">
                Región <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                placeholder="Región Metropolitana"
                value={formData.region}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="comuna">
                Comuna <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="comuna"
                name="comuna"
                placeholder="Santiago"
                value={formData.comuna}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ciudad">
                Ciudad <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                placeholder="Santiago"
                value={formData.ciudad}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </fieldset>

          {/* Seguridad */}
          <fieldset className={styles.formFieldset}>
            <legend>Seguridad</legend>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">
                Contraseña <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </fieldset>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.btnSubmit}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className={styles.linkRegister}>
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;