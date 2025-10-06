import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iptvService from '../services/iptvService';
import CacheService from '../services/cacheService';
import './Loading.css';

const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Iniciando...');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Get credentials from cache
        const credentials = CacheService.getItem(CacheService.CACHE_KEYS.CREDENTIALS);
        
        if (!credentials) {
          navigate('/');
          return;
        }

        // Set credentials
        iptvService.setCredentials(credentials.url, credentials.username, credentials.password);

        // Load live categories
        setCurrentTask('Cargando categorías de canales...');
        setProgress(20);
        const liveCategories = await iptvService.getLiveCategories();
        CacheService.setItem(CacheService.CACHE_KEYS.LIVE_CATEGORIES, liveCategories);

        // Load live streams
        setCurrentTask('Cargando lista de canales...');
        setProgress(40);
        const liveStreams = await iptvService.getLiveStreams();
        CacheService.setItem(CacheService.CACHE_KEYS.LIVE_STREAMS, liveStreams);

        // Load VOD categories
        setCurrentTask('Cargando categorías de películas...');
        setProgress(60);
        const vodCategories = await iptvService.getVODCategories();
        CacheService.setItem(CacheService.CACHE_KEYS.VOD_CATEGORIES, vodCategories);

        // Load VOD streams
        setCurrentTask('Cargando lista de películas...');
        setProgress(70);
        const vodStreams = await iptvService.getVODStreams();
        CacheService.setItem(CacheService.CACHE_KEYS.VOD_STREAMS, vodStreams);

        // Load series categories
        setCurrentTask('Cargando categorías de series...');
        setProgress(85);
        const seriesCategories = await iptvService.getSeriesCategories();
        CacheService.setItem(CacheService.CACHE_KEYS.SERIES_CATEGORIES, seriesCategories);

        // Load series
        setCurrentTask('Cargando lista de series...');
        setProgress(95);
        const series = await iptvService.getSeries();
        CacheService.setItem(CacheService.CACHE_KEYS.SERIES, series);

        setCurrentTask('¡Completado!');
        setProgress(100);

        // Navigate to menu after a short delay
        setTimeout(() => {
          navigate('/menu');
        }, 500);

      } catch (err) {
        console.error('Error loading content:', err);
        setError('Error al cargar el contenido. Por favor, intenta nuevamente.');
      }
    };

    loadContent();
  }, [navigate]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    CacheService.clear();
    navigate('/');
  };

  return (
    <div className="loading-page">
      <div className="loading-container">
        <div className="loading-header">
          <h1>IPTV Web Player</h1>
          <p>Preparando tu contenido</p>
        </div>

        {!error ? (
          <>
            <div className="loading-content">
              <div className="spinner"></div>
              <p className="loading-task">{currentTask}</p>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}>
                <span className="progress-text">{progress}%</span>
              </div>
            </div>
          </>
        ) : (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <div className="error-actions">
              <button onClick={handleRetry} className="retry-button">
                Reintentar
              </button>
              <button onClick={handleGoBack} className="back-button">
                Volver al Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
