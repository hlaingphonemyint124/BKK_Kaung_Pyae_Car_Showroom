import api from "../../../api/api";

export const getAdminFeedbacks = async (status) => {
  const res = await api.get("/admin/feedback", {
    params: status && status !== "all" ? { status } : {},
  });
  return res.data;
};

export const updateFeedbackStatus = (id, status) => {
  return api.patch(`/admin/feedback/${id}/status`, {
    is_approved: status === "approved",
  });
};

export const deleteFeedback = async (id) => {
  const res = await api.delete(`/admin/feedback/${id}`);
  return res.data;
};
