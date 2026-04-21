import API from './api';

export const getAllCars  = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return API.get(`/cars${params ? '?' + params : ''}`);
};
export const getCarById = (id) => API.get(`/cars/${id}`);