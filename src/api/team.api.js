import api from "./api";

export const getPublicTeam = async () => {
  try {
    return await api.get("/admin/users");
  } catch (err) {
    return { data: [] };
  }
};