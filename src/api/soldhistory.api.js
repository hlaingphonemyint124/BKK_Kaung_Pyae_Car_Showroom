import API from './api';

// Fetch all sale-type cars (filter status client-side)
export const getSoldHistory = () =>
  API.get('/cars', { params: { listing_type: 'sale', limit: 200 } });

// Fetch all rent-type cars (filter status client-side)
export const getRentalHistory = () =>
  API.get('/cars', { params: { listing_type: 'rent', limit: 200 } });
