import api from "../../../api/api";

export const updateCustomer = async (id, payload) => {
  const { data } = await api.patch(`/customers/${id}`, payload);
  return data;
};