import React from 'react';
import './Header.css';

const Header = ({ title, children }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>{title}</h1>
        <div className="header-actions">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;