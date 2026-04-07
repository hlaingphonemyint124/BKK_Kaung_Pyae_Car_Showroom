import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // or /api if needed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Response interceptor (for debugging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;