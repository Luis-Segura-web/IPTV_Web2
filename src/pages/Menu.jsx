import React from 'react';
import { useNavigate } from 'react-router-dom';
import CacheService from '../services/cacheService';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    CacheService.clear();
    navigate('/');
  };

  const menuItems = [
    {
      id: 'channels',
      title: 'Canales en Vivo',
      description: 'Explora y reproduce canales de TV en vivo',
      icon: '📺',
      route: '/channels',
    },
    {
      id: 'movies',
      title: 'Películas',
      description: 'Navega por nuestra colección de películas',
      icon: '🎬',
      route: '/movies',
    },
    {
      id: 'series',
      title: 'Series',
      description: 'Disfruta de tus series favoritas',
      icon: '🎭',
      route: '/series',
    },
  ];

  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>IPTV Web Player</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>

      <div className="menu-container">
        <div className="menu-welcome">
          <h2>¿Qué quieres ver hoy?</h2>
          <p>Selecciona una categoría para comenzar</p>
        </div>

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => navigate(item.route)}
            >
              <div className="menu-card-icon">{item.icon}</div>
              <h3 className="menu-card-title">{item.title}</h3>
              <p className="menu-card-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
