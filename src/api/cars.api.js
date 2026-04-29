import api from './api';

export const getAllCars  = (filters = {}) => api.get('/cars', { params: filters });
export const getCarById = (id)            => api.get(`/cars/${id}`);

