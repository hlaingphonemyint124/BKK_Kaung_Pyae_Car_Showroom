import API from "./api";

export const getNewArrivals = () =>
  API.get("/cars", {
    params: {
      listing_type: 'sale',
      sort: "newest",
      limit: 10,
    },
  });

export const getMostRented = () =>
  API.get("/cars/most-rented");
