import api from "../../../services/api";

// LOGIN
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// REGISTER
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};