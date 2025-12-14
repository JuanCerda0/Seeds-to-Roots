import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import './css/global.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();

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
          <button
            className="nav-icon"
            title="Cuenta"
            aria-label="Ir a mi cuenta"
            type="button"
            onClick={() => navigate('/login')}
          >
            👤
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
