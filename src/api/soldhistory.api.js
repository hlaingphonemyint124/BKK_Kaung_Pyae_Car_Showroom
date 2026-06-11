import API from './api';

// Sale cars (for sold history)
export const getSoldHistory = () =>
  API.get('/cars', { params: { listing_type: 'sale', limit: 200 } });

// Backend-authoritative sold stats (counts all cars, incl. unpublished)
export const getSoldStats = () =>
  API.get('/cars/sold/stats');

// Rental transaction records (admin-only)
export const getAdminRentals = () =>
  API.get('/admin/rentals', { params: { limit: 500 } });

// Rent-type cars (for car-level data: images, maintenance status)
export const getRentalHistory = () =>
  API.get('/cars', { params: { listing_type: 'rent', limit: 200 } });
