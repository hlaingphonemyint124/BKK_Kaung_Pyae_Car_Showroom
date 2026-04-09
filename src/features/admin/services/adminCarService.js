import api from "../../../services/api";

export const getAdminCars = async (params = {}) => {
  const res = await api.get("/admin/cars", { params });
  return res.data;
};

export const getAdminCarById = async (id) => {
  const res = await api.get(`/admin/cars/${id}`);
  return res.data;
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

export const addAdminCarImage = async (id, payload) => {
  const res = await api.post(`/admin/cars/${id}/images`, payload);
  return res.data;
};