import React from 'react';
import './StatsCard.css';

const StatsCard = ({ icon, title, value, className }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${className}`}>{icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;