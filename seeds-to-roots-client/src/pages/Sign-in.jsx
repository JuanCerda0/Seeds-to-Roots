import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
    alert('Función de registro - Conectar con API');
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <section className="auth-form-section">
          <h2 className="auth-title">Crear Cuenta</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

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
              Registrarse
            </button>
          </form>

          <div className="auth-links">
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
            <p><a href="/">Volver al inicio</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}