import api from './api';

export const getCarsForSale = () => api.get('/cars', { params: { listing_type: 'sale', limit: 50 } });
export const getCarsForRent = () => api.get('/cars', { params: { listing_type: 'rental', limit: 50 } });
export const getCarsByBrand = (brand) => api.get('/cars', { params: { brand, limit: 50 } });

export const getPublicCarDocuments = async (carId) => {
  const res = await api.get(`/cars/${carId}/documents`);
  return res.data;
};

export const getPublicRentalTerms = async () => {
  const res = await api.get(`/rental-terms`);
  return res.data;
};
