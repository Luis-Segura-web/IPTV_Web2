import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iptvService from '../services/iptvService';
import VideoPlayer from '../components/VideoPlayer';
import './SeriesDetails.css';

const SeriesDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSeriesDetails = async () => {
      try {
        setLoading(true);
        const seriesInfo = await iptvService.getSeriesInfo(id);
        setSeries(seriesInfo);
        
        // Set first season as selected by default
        if (seriesInfo.episodes) {
          const seasons = Object.keys(seriesInfo.episodes).sort((a, b) => Number(a) - Number(b));
          if (seasons.length > 0) {
            setSelectedSeason(seasons[0]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading series details:', err);
        setError('Error al cargar los detalles de la serie');
        setLoading(false);
      }
    };

    loadSeriesDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/series');
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setSelectedEpisode(null);
  };

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
  };

  const getEpisodeUrl = (episode) => {
    if (episode.id) {
      const extension = episode.container_extension || 'mp4';
      return iptvService.getSeriesUrl(episode.id, extension);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="series-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="series-details-page">
        <div className="error-container">
          <p>{error || 'Serie no encontrada'}</p>
          <button onClick={handleBack} className="back-button">
            Volver a Series
          </button>
        </div>
      </div>
    );
  }

  const info = series.info || {};
  const episodes = series.episodes || {};
  const seasons = Object.keys(episodes).sort((a, b) => Number(a) - Number(b));
  const currentSeasonEpisodes = selectedSeason ? episodes[selectedSeason] || [] : [];

  return (
    <div className="series-details-page">
      <header className="series-details-header">
        <button onClick={handleBack} className="back-button">
          ← Volver a Series
        </button>
      </header>

      <div className="series-details-container">
        {/* Player Section */}
        <div className="series-player-section">
          {selectedEpisode ? (
            <>
              <VideoPlayer
                src={getEpisodeUrl(selectedEpisode)}
                poster={selectedEpisode.info?.movie_image || info.cover}
                autoPlay={true}
              />
              <div className="episode-info-bar">
                <h3>{selectedEpisode.title}</h3>
                <p>Temporada {selectedSeason} - Episodio {selectedEpisode.episode_num}</p>
              </div>
            </>
          ) : (
            <div className="player-placeholder">
              <p>Selecciona un episodio para comenzar a reproducir</p>
            </div>
          )}
        </div>

        {/* Info and Episodes Section */}
        <div className="series-content-section">
          {/* Series Info */}
          <div className="series-info-header">
            {info.cover && (
              <div className="series-poster-small">
                <img src={info.cover} alt={info.name} />
              </div>
            )}
            <div className="series-title-section">
              <h1 className="series-title">{info.name || 'Sin título'}</h1>
              <div className="series-meta">
                {info.releaseDate && (
                  <span className="meta-item">📅 {info.releaseDate}</span>
                )}
                {info.rating && (
                  <span className="meta-item">⭐ {info.rating}</span>
                )}
              </div>
              {info.genre && (
                <div className="series-genres">
                  {info.genre.split(',').map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {info.plot && (
            <div className="series-description">
              <h2>Sinopsis</h2>
              <p>{info.plot}</p>
            </div>
          )}

          {info.cast && (
            <div className="series-detail-item">
              <strong>Reparto:</strong> {info.cast}
            </div>
          )}

          {info.director && (
            <div className="series-detail-item">
              <strong>Director:</strong> {info.director}
            </div>
          )}

          {/* Seasons and Episodes */}
          <div className="episodes-section">
            <h2>Episodios</h2>
            
            {/* Season Selector */}
            {seasons.length > 0 && (
              <div className="season-selector">
                {seasons.map((season) => (
                  <button
                    key={season}
                    className={`season-button ${selectedSeason === season ? 'active' : ''}`}
                    onClick={() => handleSeasonChange(season)}
                  >
                    Temporada {season}
                  </button>
                ))}
              </div>
            )}

            {/* Episodes List */}
            <div className="episodes-list">
              {currentSeasonEpisodes.map((episode) => (
                <div
                  key={episode.id}
                  className={`episode-item ${selectedEpisode?.id === episode.id ? 'active' : ''}`}
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="episode-thumbnail">
                    {episode.info?.movie_image ? (
                      <img src={episode.info.movie_image} alt={episode.title} />
                    ) : (
                      <div className="episode-thumbnail-placeholder">
                        {episode.episode_num}
                      </div>
                    )}
                  </div>
                  <div className="episode-details">
                    <h4 className="episode-title">
                      {episode.episode_num}. {episode.title}
                    </h4>
                    {episode.info?.plot && (
                      <p className="episode-plot">{episode.info.plot}</p>
                    )}
                    {episode.info?.duration && (
                      <span className="episode-duration">⏱️ {episode.info.duration}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentSeasonEpisodes.length === 0 && (
              <div className="no-episodes">
                <p>No hay episodios disponibles para esta temporada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
