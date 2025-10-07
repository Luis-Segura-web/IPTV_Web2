import axios from 'axios';

class IPTVService {
  constructor() {
    this.baseUrl = '';
    this.username = '';
    this.password = '';
  }

  setCredentials(url, username, password) {
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.username = username;
    this.password = password;
  }

  async authenticate() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}`
      );
      return response.data;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async getLiveCategories() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_live_categories`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching live categories:', error);
      throw error;
    }
  }

  async getLiveStreams(categoryId = null) {
    try {
      const url = categoryId
        ? `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_live_streams&category_id=${categoryId}`
        : `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_live_streams`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  }

  async getVODCategories() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_vod_categories`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching VOD categories:', error);
      throw error;
    }
  }

  async getVODStreams(categoryId = null) {
    try {
      const url = categoryId
        ? `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_vod_streams&category_id=${categoryId}`
        : `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_vod_streams`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching VOD streams:', error);
      throw error;
    }
  }

  async getVODInfo(vodId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_vod_info&vod_id=${vodId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching VOD info:', error);
      throw error;
    }
  }

  async getSeriesCategories() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_series_categories`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching series categories:', error);
      throw error;
    }
  }

  async getSeries(categoryId = null) {
    try {
      const url = categoryId
        ? `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_series&category_id=${categoryId}`
        : `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_series`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }

  async getSeriesInfo(seriesId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}&action=get_series_info&series_id=${seriesId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching series info:', error);
      throw error;
    }
  }

  getStreamUrl(streamId, extension = 'ts') {
    return `${this.baseUrl}/live/${this.username}/${this.password}/${streamId}.${extension}`;
  }

  getMovieUrl(streamId, extension = 'mp4') {
    return `${this.baseUrl}/movie/${this.username}/${this.password}/${streamId}.${extension}`;
  }

  getSeriesUrl(streamId, extension = 'mp4') {
    return `${this.baseUrl}/series/${this.username}/${this.password}/${streamId}.${extension}`;
  }
}

export default new IPTVService();
