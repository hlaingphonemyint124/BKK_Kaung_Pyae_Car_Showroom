import API from './api';

export const getCarsForSale = () => API.get('/cars?limit=20');
export const getCarsForRent = () => API.get('/cars?limit=20');
export const getCarsByType  = (type)  => API.get(`/cars?type=${type}`);
export const getCarsByBrand = (brand) => API.get(`/cars?brand=${brand}`);
export const searchCars     = (query) => API.get(`/cars?search=${query}`);