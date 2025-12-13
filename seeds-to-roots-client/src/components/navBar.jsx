import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import '../components/css/NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleCartClick = () => {
    navigate('/carrito');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="header-container">
        <div className="logo">
          <button 
            onClick={handleLogoClick}
            className="logo-button"
            title="Ir a inicio"
          >
            🌱 Seeds to Roots
          </button>
        </div>

        <nav className="nav-links">
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </nav>

        <div className="nav-icons">
          <button 
            className="nav-icon" 
            title="Buscar"
            aria-label="Buscar"
          >
            🔍
          </button>
          
          <button 
            className="nav-icon cart-icon" 
            title="Carrito"
            onClick={handleCartClick}
            aria-label="Ir al carrito"
          >
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          <button 
            className="nav-icon" 
            title="Cuenta"
            onClick={handleLoginClick}
            aria-label="Ir a mi cuenta"
          >
            👤
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
