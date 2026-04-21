import API from './api';

export const getBestSellers = () => API.get('/cars/best-sellers');
export const getMostRented  = () => API.get('/cars/most-rented');