import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ✅ FIXED
  withCredentials: true,            // ✅ VERY IMPORTANT (for cookies)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;