import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CacheService from '../services/cacheService';
import './Series.css';

const Series = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const cachedCategories = CacheService.getItem(CacheService.CACHE_KEYS.SERIES_CATEGORIES);
        const cachedSeries = CacheService.getItem(CacheService.CACHE_KEYS.SERIES);

        if (!cachedCategories || !cachedSeries) {
          navigate('/loading');
          return;
        }

        setCategories(cachedCategories || []);
        setSeries(cachedSeries || []);
        setFilteredSeries(cachedSeries || []);
        setLoading(false);

        // Set first category as selected by default
        if (cachedCategories && cachedCategories.length > 0) {
          setSelectedCategory('all');
        }
      } catch (error) {
        console.error('Error loading series:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    let filtered = series;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (show) => show.category_id === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((show) =>
        show.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSeries(filtered);
  }, [selectedCategory, searchTerm, series]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  const handleSeriesClick = (show) => {
    navigate(`/series/${show.series_id}`);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  if (loading) {
    return (
      <div className="series-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="series-page">
      <header className="series-header">
        <button onClick={handleBackToMenu} className="back-button">
          ← Volver al Menú
        </button>
        <h1>Series</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="series-layout">
        {/* Sidebar: Categories */}
        <aside className="series-sidebar">
          <h2 className="sidebar-title">Categorías</h2>
          <div className="categories-list">
            <button
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              <span>Todas las Series</span>
              <span className="category-count">{series.length}</span>
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

        {/* Main: Series Grid */}
        <main className="series-main">
          <div className="series-info">
            <h2>
              {selectedCategory === 'all'
                ? 'Todas las Series'
                : categories.find((c) => c.category_id === selectedCategory)?.category_name}
            </h2>
            <p className="series-count">{filteredSeries.length} series</p>
          </div>

          <div className="series-grid">
            {filteredSeries.map((show) => (
              <div
                key={show.series_id}
                className="series-card"
                onClick={() => handleSeriesClick(show)}
              >
                <div className="series-poster">
                  {show.cover ? (
                    <img src={show.cover} alt={show.name} />
                  ) : (
                    <div className="series-poster-placeholder">🎭</div>
                  )}
                </div>
                <div className="series-details">
                  <h3 className="series-title">{show.name}</h3>
                  {show.rating && (
                    <div className="series-rating">⭐ {show.rating}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSeries.length === 0 && (
            <div className="no-results">
              <p>No se encontraron series</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Series;
