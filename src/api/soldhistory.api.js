import API from './api';

export const getSoldHistory  = () => API.get('/cars', { params: { price_min: 1, limit: 200 } });

export const getSoldStats = () => API.get('/cars/sold/stats');