import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iptvService from '../services/iptvService';
import CacheService from '../services/cacheService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    url: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.url || !formData.username || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(formData.url)) {
      setError('La URL debe comenzar con http:// o https://');
      return;
    }

    setLoading(true);

    try {
      // Set credentials
      iptvService.setCredentials(formData.url, formData.username, formData.password);

      // Try to authenticate
      await iptvService.authenticate();

      // Save credentials to cache
      CacheService.setItem(CacheService.CACHE_KEYS.CREDENTIALS, formData);

      // Navigate to loading page
      navigate('/loading');
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de autenticación. Verifica tus credenciales y la URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>IPTV Web Player</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">URL del Servidor</label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="http://ejemplo.com o https://ejemplo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
