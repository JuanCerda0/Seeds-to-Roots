import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import authService from '../services/authService';
import './css/global.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [currentUser, setCurrentUser] = useState(() =>
    authService.getCurrentUser()
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-change', handleAuthChange);
      window.addEventListener('storage', handleAuthChange);
      return () => {
        window.removeEventListener('auth-change', handleAuthChange);
        window.removeEventListener('storage', handleAuthChange);
      };
    }
    return undefined;
  }, []);

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    { label: 'Cómo Funciona', to: '/#como-funciona' },
    { label: 'Contacto', to: '/#contacto' },
    { label: 'Blog', to: '/blog' },
  ];

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <Link to="/" aria-label="Inicio Seeds to Roots">
            🌱 Seeds to Roots
          </Link>
        </div>
        <nav>
          <ul>
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-icons">
          <button
            className="nav-icon"
            title="Buscar"
            aria-label="Buscar"
            type="button"
          >
            🔍
          </button>
          <button
            className="nav-icon"
            title="Ver carrito"
            aria-label="Ir al carrito"
            type="button"
            onClick={() => navigate('/carrito')}
          >
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
          {currentUser ? (
            <details className="user-menu">
              <summary>
                <span className="user-chip" title={currentUser.email}>
                  👤 {currentUser.email}
                </span>
              </summary>
              <div className="user-dropdown">
                <button
                  type="button"
                  className="logout-button"
                  onClick={() => authService.logout()}
                >
                  Cerrar sesión
                </button>
              </div>
            </details>
          ) : (
            <button
              className="nav-icon"
              title="Ingresar"
              aria-label="Ir a mi cuenta"
              type="button"
              onClick={() => navigate('/login')}
            >
              👤
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
