import api from "../../../api/api";

// ─── CARS ────────────────────────────────────────────────
export const getAdminCars = async (params = {}) => {
  const res = await api.get("/admin/cars", { params });
  return res.data;
};

export const getAdminCarById = async (id) => {
  const res = await api.get(`/admin/cars/${id}`);
  const d = res.data;

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

// ─── CAR IMAGES ──────────────────────────────────────────
export const addAdminCarImage = async (
  id,
  file,
  { isPrimary = false, sortOrder = 0 } = {}
) => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("is_primary", isPrimary ? "true" : "false");
  formData.append("sort_order", String(sortOrder));

  const res = await api.post(`/admin/cars/${id}/images`, formData);

  return res.data;
};

export const updateAdminCarImage = async (carId, imageId, payload) => {
  const res = await api.patch(`/admin/cars/${carId}/images/${imageId}`, payload);
  return res.data;
};

export const deleteAdminCarImage = async (carId, imageId) => {
  const res = await api.delete(`/admin/cars/${carId}/images/${imageId}`);
  return res.data;
};

// ─── CAR DOCUMENTS ───────────────────────────────────────
export const getCarDocuments = async (carId) => {
  const res = await api.get(`/admin/cars/${carId}/documents`);
  return res.data;
};

export const createCarDocument = async (carId, payload) => {
  const res = await api.post(`/admin/cars/${carId}/documents`, payload);
  return res.data;
};

export const updateCarDocument = async (carId, documentId, payload) => {
  const res = await api.patch(
    `/admin/cars/${carId}/documents/${documentId}`,
    payload
  );
  return res.data;
};

export const deleteCarDocument = async (carId, documentId) => {
  const res = await api.delete(`/admin/cars/${carId}/documents/${documentId}`);
  return res.data;
};

// ─── RENTAL TERMS ────────────────────────────────────────
export const getRentalTerms = async () => {
  const res = await api.get("/admin/rental-terms");
  return res.data;
};

export const createRentalTerm = async (payload) => {
  const res = await api.post("/admin/rental-terms", payload);
  return res.data;
};

export const updateRentalTerm = async (id, payload) => {
  const res = await api.patch(`/admin/rental-terms/${id}`, payload);
  return res.data;
};

export const deleteRentalTerm = async (id) => {
  const res = await api.delete(`/admin/rental-terms/${id}`);
  return res.data;
};