import api from './api';

// price_min=1 → backend filters WHERE sale_price >= 1 (excludes NULL / rental-only cars)
// rent_price_min=1 → backend filters WHERE rent_price_per_day >= 1 (excludes NULL / sale-only cars)
export const getCarsForSale = () => api.get('/cars', { params: { price_min: 1, limit: 50 } });
export const getCarsForRent = () => api.get('/cars', { params: { rent_price_min: 1, limit: 50 } });
export const getCarsByBrand = (brand) => api.get('/cars', { params: { brand, limit: 50 } });

export const getPublicCarDocuments = async (carId) => {
  const res = await api.get(`/cars/${carId}/documents`);
  return res.data;
};

export const getPublicRentalTerms = async () => {
  const res = await api.get(`/rental-terms`);
  return res.data;
};