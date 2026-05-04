import API from "../../../api/api";

export const getUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const createUser = async (payload) => {
  const res = await API.post("/admin/users", payload);
  return res.data;
};

export const promoteToEmployee = async (id) => {
  const res = await API.patch(`/admin/users/${id}/role`, {
    role: "employee",
  });
  return res.data;
};

export const demoteToClient = async (id) => {
  const res = await API.patch(`/admin/users/${id}/role`, {
    role: "client",
  });
  return res.data;
};

export const deactivateUser = async (id) => {
  const res = await API.patch(`/admin/users/${id}`, {
    is_active: false,
  });
  return res.data;
};

export const reactivateUser = async (id) => {
  const res = await API.patch(`/admin/users/${id}`, {
    is_active: true,
  });
  return res.data;
};

export const hardDeleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}/hard`, {
    data: {
      confirm: "DELETE",
    },
  });
  return res.data;
};