import API from './api';

export const sendContact = (data) => API.post('/contact', data);