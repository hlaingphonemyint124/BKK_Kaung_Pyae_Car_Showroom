import API from './api';

export const getSoldHistory  = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return API.get(`/cars/sold${query ? '?' + query : ''}`);
};

export const getSoldStats = () => API.get('/cars/sold/stats');