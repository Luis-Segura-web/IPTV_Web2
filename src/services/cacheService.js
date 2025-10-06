class CacheService {
  static CACHE_KEYS = {
    CREDENTIALS: 'iptv_credentials',
    LIVE_CATEGORIES: 'iptv_live_categories',
    LIVE_STREAMS: 'iptv_live_streams',
    VOD_CATEGORIES: 'iptv_vod_categories',
    VOD_STREAMS: 'iptv_vod_streams',
    SERIES_CATEGORIES: 'iptv_series_categories',
    SERIES: 'iptv_series',
  };

  static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  static setItem(key, value) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting cache item:', error);
      return false;
    }
  }

  static getItem(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      // Check if item has expired
      if (now - item.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing cache item:', error);
      return false;
    }
  }

  static clear() {
    try {
      Object.values(this.CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  static isValid(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return false;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      return now - item.timestamp <= this.CACHE_DURATION;
    } catch (error) {
      return false;
    }
  }
}

export default CacheService;
