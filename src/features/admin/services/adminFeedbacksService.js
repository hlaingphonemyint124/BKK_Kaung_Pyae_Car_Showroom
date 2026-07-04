import api from "../../../api/api";

export const getAdminFeedbacks = async (status) => {
  const res = await api.get("/admin/feedback", {
    params:
      status === "approved" ? { is_approved: true } :
      status === "pending" || status === "rejected" ? { is_approved: false } :
      {},
  });
  return res.data;
};

export const updateFeedbackStatus = (id, isApproved) => {
  return api.patch(`/admin/feedback/${id}/status`, { is_approved: isApproved });
};

export const deleteFeedback = async (id) => {
  const res = await api.delete(`/admin/feedback/${id}`);
  return res.data;
};
