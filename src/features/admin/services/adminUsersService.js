import api from "../../../api/api";

export const getUsers = async (filters = {}) => {
  const res = await api.get("/admin/users", { params: filters });
  return res.data;
};

export const promoteToEmployee = async (id) => {
  const res = await api.patch(`/admin/users/${id}/role`, { role: "employee" });
  return res.data;
};

export const demoteToClient = async (id) => {
  const res = await api.patch(`/admin/users/${id}/role`, { role: "client" });
  return res.data;
};

export const createUser = async (payload) => {
  const res = await api.post("/admin/users", payload);
  return res.data;
};
