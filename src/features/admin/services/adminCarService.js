import api from "../../../services/api";

// ─── CARS ────────────────────────────────────────────────
export const getAdminCars = async (params = {}) => {
  const res = await api.get("/admin/cars", { params });
  return res.data;
};

export const getAdminCarById = async (id) => {
  const res = await api.get(`/admin/cars/${id}`);
  const d = res.data;
  // Unwrap envelope: { car: {...} } | { data: {...} } | {...}
  return d?.car ?? d?.data?.car ?? d?.data ?? d;
};

export const createAdminCar = async (payload) => {
  const res = await api.post("/admin/cars", payload);
  return res.data;
};

export const updateAdminCar = async (id, payload) => {
  const res = await api.patch(`/admin/cars/${id}`, payload);
  return res.data;
};

export const deleteAdminCar = async (id) => {
  const res = await api.delete(`/admin/cars/${id}`);
  return res.data;
};

export const updateAdminCarPublishStatus = async (id, is_published) => {
  const res = await api.patch(`/admin/cars/${id}/publish`, { is_published });
  return res.data;
};

export const addAdminCarImage = async (
  id,
  file,
  { isPrimary = false, sortOrder = 0 } = {}
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("is_primary", String(isPrimary));
  formData.append("sort_order", String(sortOrder));

  const res = await api.post(`/admin/cars/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ─── CAR DOCUMENTS (migration 014) ───────────────────────
// GET /admin/cars/:id/documents → [{ id, field_name, field_value, sort_order }]
export const getCarDocuments = async (carId) => {
  const res = await api.get(`/admin/cars/${carId}/documents`);
  return res.data;
};

// PUT /admin/cars/:id/documents → replaces all documents for the car
// body: { documents: [{ field_name, field_value, sort_order }] }
export const saveCarDocuments = async (carId, documents) => {
  const res = await api.put(`/admin/cars/${carId}/documents`, { documents });
  return res.data;
};

// ─── RENTAL TERMS (migration 013) ────────────────────────
// GET /admin/rental-terms → [{ id, title, description, sort_order, is_active }]
export const getRentalTerms = async () => {
  const res = await api.get("/admin/rental-terms");
  return res.data;
};

// POST /admin/rental-terms
// body: { title, description, sort_order }
export const createRentalTerm = async (payload) => {
  const res = await api.post("/admin/rental-terms", payload);
  return res.data;
};

// PATCH /admin/rental-terms/:id
export const updateRentalTerm = async (id, payload) => {
  const res = await api.patch(`/admin/rental-terms/${id}`, payload);
  return res.data;
};

// DELETE /admin/rental-terms/:id
export const deleteRentalTerm = async (id) => {
  const res = await api.delete(`/admin/rental-terms/${id}`);
  return res.data;
};
