import api from "../../../services/api";

export const getAdminCars = async () => {
  const response = await api.get("/admin/cars");
  return response.data;
};

export const getAdminCarById = async (id) => {
  const response = await api.get(`/admin/cars/${id}`);
  return response.data;
};

export const createAdminCar = async (carData) => {
  const response = await api.post("/admin/cars", carData);
  return response.data;
};

export const updateAdminCar = async (id, carData) => {
  const response = await api.patch(`/admin/cars/${id}`, carData);
  return response.data;
};

export const deleteAdminCar = async (id) => {
  const response = await api.delete(`/admin/cars/${id}`);
  return response.data;
};

export const publishAdminCar = async (id, is_published) => {
  const response = await api.patch(`/admin/cars/${id}/publish`, {
    is_published,
  });
  return response.data;
};