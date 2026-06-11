import api from "./api";

export const getPublicTeam = async () => {
  try {
    return await api.get("/users/team");
  } catch (err) {
    return { data: [] };
  }
};