import api from "../../../api/api";

export const getDealerContact = async () => {
  const { data } = await api.get("/dealer-contact");
  return data;
};

export const getAdminDealerContact = async () => {
  const { data } = await api.get("/admin/dealer-contact");
  return data;
};

export const updateAdminDealerContact = async (payload) => {
  const { data } = await api.patch("/admin/dealer-contact", payload);
  return data;
};