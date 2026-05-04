import API from "./api";

export const getNewArrivals = () =>
  API.get("/cars", {
    params: {
      price_min: 1,
      sort: "newest",
      limit: 10,
    },
  });

export const getMostRented = () => API.get("/cars/most-rented");