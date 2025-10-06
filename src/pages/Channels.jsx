import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CacheService from '../services/cacheService';
import iptvService from '../services/iptvService';
import VideoPlayer from '../components/VideoPlayer';
import './Channels.css';

const Channels = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const cachedCategories = CacheService.getItem(CacheService.CACHE_KEYS.LIVE_CATEGORIES);
        const cachedChannels = CacheService.getItem(CacheService.CACHE_KEYS.LIVE_STREAMS);

        if (!cachedCategories || !cachedChannels) {
          navigate('/loading');
          return;
        }

        setCategories(cachedCategories || []);
        setChannels(cachedChannels || []);
        setFilteredChannels(cachedChannels || []);
        setLoading(false);

        // Set first category as selected by default
        if (cachedCategories && cachedCategories.length > 0) {
          setSelectedCategory(cachedCategories[0].category_id);
        }
      } catch (error) {
        console.error('Error loading channels:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    if (selectedCategory === null || selectedCategory === 'all') {
      setFilteredChannels(channels);
    } else {
      const filtered = channels.filter(
        (channel) => channel.category_id === selectedCategory
      );
      setFilteredChannels(filtered);
    }
    setSelectedChannel(null);
  }, [selectedCategory, channels]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const getStreamUrl = (channel) => {
    if (channel.stream_id) {
      const extension = channel.container_extension || 'ts';
      return iptvService.getStreamUrl(channel.stream_id, extension);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="channels-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando canales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="channels-page">
      <header className="channels-header">
        <button onClick={handleBackToMenu} className="back-button">
          ← Volver al Menú
        </button>
        <h1>Canales en Vivo</h1>
      </header>

      <div className="channels-layout">
        {/* Column 1: Categories */}
        <aside className="categories-column">
          <h2 className="column-title">Categorías</h2>
          <div className="categories-list">
            <button
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              <span>Todos los Canales</span>
              <span className="category-count">{channels.length}</span>
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

        {/* Column 2: Channels List */}
        <div className="channels-column">
          <h2 className="column-title">
            Canales ({filteredChannels.length})
          </h2>
          <div className="channels-list">
            {filteredChannels.map((channel) => (
              <div
                key={channel.stream_id}
                className={`channel-item ${selectedChannel?.stream_id === channel.stream_id ? 'active' : ''}`}
                onClick={() => handleChannelClick(channel)}
              >
                <div className="channel-logo">
                  {channel.stream_icon ? (
                    <img src={channel.stream_icon} alt={channel.name} />
                  ) : (
                    <div className="channel-logo-placeholder">📺</div>
                  )}
                </div>
                <div className="channel-info">
                  <h3 className="channel-name">{channel.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Player */}
        <div className="player-column">
          <h2 className="column-title">Reproductor</h2>
          <div className="player-container">
            {selectedChannel ? (
              <>
                <VideoPlayer
                  src={getStreamUrl(selectedChannel)}
                  poster={selectedChannel.stream_icon}
                  autoPlay={true}
                />
                <div className="player-info">
                  <h3>{selectedChannel.name}</h3>
                  {selectedChannel.epg_channel_id && (
                    <p className="channel-epg">EPG ID: {selectedChannel.epg_channel_id}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="player-placeholder">
                <p>Selecciona un canal para comenzar a reproducir</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;
