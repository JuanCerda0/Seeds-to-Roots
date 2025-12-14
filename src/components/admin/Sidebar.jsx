import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Link to="/">
            <h2>🌱 Seeds to Roots</h2>
          </Link>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link 
              to="/admin/dashboard" 
              className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/products" 
              className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}
            >
              Productos
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
            >
              Usuarios
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;