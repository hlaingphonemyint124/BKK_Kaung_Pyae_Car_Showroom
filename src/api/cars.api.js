import API from './api';

export const getAllCars  = (filters = {}) => API.get('/cars', { params: filters });
export const getCarById = (id)            => API.get(`/cars/${id}`);