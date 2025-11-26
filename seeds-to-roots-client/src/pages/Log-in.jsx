import React, { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
    alert('Función de login - Conectar con API');
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <section className="auth-form-section">
          <h2 className="auth-title">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Iniciar Sesión
            </button>
          </form>

          <div className="auth-links">
            <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
            <p><a href="/">Volver al inicio</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}