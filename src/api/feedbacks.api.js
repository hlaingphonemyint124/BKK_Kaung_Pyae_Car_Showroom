import api from "./api";

export const getApprovedFeedbacks = (params = {}) =>
  api.get("/feedback", { params });

export const submitFeedback = (payload) =>
  api.post("/feedback", payload);
