import API from './api';

// price_min=1 → backend filters WHERE sale_price >= 1 (excludes NULL / rental-only cars)
// rent_price_min=1 → backend filters WHERE rent_price_per_day >= 1 (excludes NULL / sale-only cars)
export const getCarsForSale = () => API.get('/cars', { params: { price_min: 1, limit: 50 } });
export const getCarsForRent = () => API.get('/cars', { params: { rent_price_min: 1, limit: 50 } });
export const getCarsByBrand = (brand) => API.get('/cars', { params: { brand, limit: 50 } });