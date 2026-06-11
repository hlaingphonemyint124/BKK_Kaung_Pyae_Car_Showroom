import api from "./api";

export const getApprovedFeedbacks = (params = {}) =>
  api.get("/feedbacks", { params });

export const submitFeedback = (payload) =>
  api.post("/feedbacks", payload);
