import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iptvService from '../services/iptvService';
import VideoPlayer from '../components/VideoPlayer';
import './MovieDetails.css';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        const movieInfo = await iptvService.getVODInfo(id);
        setMovie(movieInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error loading movie details:', err);
        setError('Error al cargar los detalles de la película');
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/movies');
  };

  const getMovieUrl = () => {
    if (movie?.movie_data) {
      const extension = movie.movie_data.container_extension || 'mp4';
      return iptvService.getMovieUrl(movie.movie_data.stream_id, extension);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="movie-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-details-page">
        <div className="error-container">
          <p>{error || 'Película no encontrada'}</p>
          <button onClick={handleBack} className="back-button">
            Volver a Películas
          </button>
        </div>
      </div>
    );
  }

  const movieData = movie.movie_data || {};
  const info = movie.info || {};

  return (
    <div className="movie-details-page">
      <header className="movie-details-header">
        <button onClick={handleBack} className="back-button">
          ← Volver a Películas
        </button>
      </header>

      <div className="movie-details-container">
        {/* Player Section */}
        <div className="movie-player-section">
          <VideoPlayer
            src={getMovieUrl()}
            poster={info.movie_image || info.cover_big}
            autoPlay={false}
          />
        </div>

        {/* Info Section */}
        <div className="movie-info-section">
          <div className="movie-header-info">
            {info.movie_image && (
              <div className="movie-poster-small">
                <img src={info.movie_image} alt={movieData.name} />
              </div>
            )}
            <div className="movie-title-section">
              <h1 className="movie-title">{movieData.name || 'Sin título'}</h1>
              <div className="movie-meta">
                {info.releasedate && (
                  <span className="meta-item">📅 {info.releasedate}</span>
                )}
                {info.rating && (
                  <span className="meta-item">⭐ {info.rating}</span>
                )}
                {info.duration && (
                  <span className="meta-item">⏱️ {info.duration}</span>
                )}
              </div>
              {info.genre && (
                <div className="movie-genres">
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
            <div className="movie-description">
              <h2>Sinopsis</h2>
              <p>{info.plot}</p>
            </div>
          )}

          {info.director && (
            <div className="movie-detail-item">
              <strong>Director:</strong> {info.director}
            </div>
          )}

          {info.cast && (
            <div className="movie-detail-item">
              <strong>Reparto:</strong> {info.cast}
            </div>
          )}

          {info.youtube_trailer && (
            <div className="movie-trailer">
              <a
                href={`https://www.youtube.com/watch?v=${info.youtube_trailer}`}
                target="_blank"
                rel="noopener noreferrer"
                className="trailer-button"
              >
                🎬 Ver Tráiler
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
