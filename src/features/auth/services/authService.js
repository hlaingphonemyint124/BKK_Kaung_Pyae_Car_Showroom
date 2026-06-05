import api from "../../../api/api";

// LOGIN
export const loginUser = async (userData) => {
  const payload = {
    ...userData,
    email: String(userData.email || "").trim().toLowerCase(),
  };
  if (process.env.NODE_ENV === "development") {
    console.log("LOGIN_PAYLOAD_SAFE", { email: payload.email });
  }

  try {
    const response = await api.post("/auth/login", payload);
    if (process.env.NODE_ENV === "development") {
      console.log("LOGIN_RESPONSE_STATUS", response.status);
    }
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("LOGIN_RESPONSE_STATUS", error.response?.status);
      console.log("LOGIN_ERROR", error.response?.data?.error || error.response?.data?.message || error.message);
    }
    throw error;
  }
};

// SIGN UP
export const signupUser = async (payload) => {
  const { data } = await api.post("/auth/register", {
    ...payload,
    email: String(payload.email || "").trim().toLowerCase(),
  });
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
