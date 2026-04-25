import api from "../../../services/api";

// LOGIN
export const loginUser = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

// SIGN UP
export const signupUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

// RESEND VERIFICATION
export const resendVerification = async (payload) => {
  const { data } = await api.post("/auth/resend-verification", payload);
  return data;
};

// VERIFY EMAIL
export const verifyEmail = async (token) => {
  const { data } = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  return data;
};

// FORGOT PASSWORD
export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};

// RESET PASSWORD
export const resetPassword = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

// LOGOUT
export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};