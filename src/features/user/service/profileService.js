import api from "../../../api/api";

export const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/profile", payload);
  return data;
};