
// ⚠️ Backend doesn't have /brands yet — keep using fallback
// Ask backend dev to add GET /brands endpoint later
import API from './api';

export const getAllBrands = () => API.get('/brands');  // not ready yet