import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CacheService from '../services/cacheService';
import './Movies.css';

const Movies = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const cachedCategories = CacheService.getItem(CacheService.CACHE_KEYS.VOD_CATEGORIES);
        const cachedMovies = CacheService.getItem(CacheService.CACHE_KEYS.VOD_STREAMS);

        if (!cachedCategories || !cachedMovies) {
          navigate('/loading');
          return;
        }

        setCategories(cachedCategories || []);
        setMovies(cachedMovies || []);
        setFilteredMovies(cachedMovies || []);
        setLoading(false);

        // Set first category as selected by default
        if (cachedCategories && cachedCategories.length > 0) {
          setSelectedCategory('all');
        }
      } catch (error) {
        console.error('Error loading movies:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    let filtered = movies;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (movie) => movie.category_id === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [selectedCategory, searchTerm, movies]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  const handleMovieClick = (movie) => {
    navigate(`/movies/${movie.stream_id}`);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  if (loading) {
    return (
      <div className="movies-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando películas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <header className="movies-header">
        <button onClick={handleBackToMenu} className="back-button">
          ← Volver al Menú
        </button>
        <h1>Películas</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar películas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="movies-layout">
        {/* Sidebar: Categories */}
        <aside className="movies-sidebar">
          <h2 className="sidebar-title">Categorías</h2>
          <div className="categories-list">
            <button
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              <span>Todas las Películas</span>
              <span className="category-count">{movies.length}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.category_id}
                className={`category-item ${selectedCategory === category.category_id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.category_id)}
              >
                <span>{category.category_name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main: Movies Grid */}
        <main className="movies-main">
          <div className="movies-info">
            <h2>
              {selectedCategory === 'all'
                ? 'Todas las Películas'
                : categories.find((c) => c.category_id === selectedCategory)?.category_name}
            </h2>
            <p className="movies-count">{filteredMovies.length} películas</p>
          </div>

          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <div
                key={movie.stream_id}
                className="movie-card"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="movie-poster">
                  {movie.stream_icon ? (
                    <img src={movie.stream_icon} alt={movie.name} />
                  ) : (
                    <div className="movie-poster-placeholder">🎬</div>
                  )}
                </div>
                <div className="movie-details">
                  <h3 className="movie-title">{movie.name}</h3>
                  {movie.rating && (
                    <div className="movie-rating">⭐ {movie.rating}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="no-results">
              <p>No se encontraron películas</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Movies;
