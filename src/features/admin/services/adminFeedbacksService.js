import api from "../../../api/api";

export const getAdminFeedbacks = async (status) => {
  const res = await api.get("/admin/feedbacks", {
    params: status && status !== "all" ? { status } : {},
  });
  return res.data;
};

export const updateFeedbackStatus = (id, status) => {
  return api.patch(`/admin/feedbacks/${id}/status`, { status });
};

export const deleteFeedback = async (id) => {
  const res = await api.delete(`/admin/feedbacks/${id}`);
  return res.data;
};
