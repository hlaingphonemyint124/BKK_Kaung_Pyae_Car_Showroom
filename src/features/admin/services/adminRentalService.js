import api from "../../../api/api";

export const getAdminRentalCars = async () => {
  const res = await api.get("/admin/cars", {
    params: { listing_type: "rent", limit: 500 },
  });
  return res.data;
};

export const getAdminCustomers = async () => {
  const res = await api.get("/admin/customers", {
    params: { limit: 500 },
  });
  return res.data;
};

export const createAdminCustomer = async (payload) => {
  const res = await api.post("/admin/customers", payload);
  return res.data;
};

export const createAdminRental = async (payload) => {
  const res = await api.post("/admin/rentals", payload);
  return res.data;
};
