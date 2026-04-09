import { useEffect, useMemo, useState } from "react";
import {
  getAdminCars,
  deleteAdminCar,
  updateAdminCar,
} from "../services/adminCarService";

function useAdminCars(type) {
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeCardId, setActiveCardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminCars();

        console.log("RAW API:", data);

        const carList =
          data?.cars ||
          data?.data?.cars ||
          data?.data ||
          data?.rows ||
          [];

        console.log("CAR LIST:", carList);

        const mappedCars = carList.map((car) => ({
          id: car.id,
          brand: car.brand || "",
          model: car.model || "",
          name: `${car.brand || ""} ${car.model || ""}`.trim(),

          primary_image: car.primary_image || "",

          image:
            car.primary_image ||
            car.image ||
            car.images?.find((img) => img.is_primary)?.storage_path ||
            car.images?.[0]?.storage_path ||
            "",

          images: car.images || [],

          // ✅ REAL pricing fields
          sale_price: car.sale_price,
          rent_price_per_day: car.rent_price_per_day,

          // ✅ specs (used in card)
          specs: {
            fuel: car.fuel_type || car.fuel || "Petrol",
            drive: car.drive_type || car.drive || "2WD",
            doors: car.doors || 4,
            seats: car.seats || 4,
            transmission: car.transmission || "Auto",
          },

          // ✅ raw backend status
          rawStatus: car.status || "available",

          // ✅ UI status
          status: {
            isNewArrival: car.is_new_arrival || false,
            isBestSeller: car.is_best_seller || false,
            isMostRented: car.is_most_rented || false,
            isAvailable:
              car.status !== "rented" &&
              car.status !== "sold" &&
              car.status !== "maintenance",
          },
        }));

        console.log("MAPPED CARS:", mappedCars);

        setCars(mappedCars);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setError(err.response?.data?.error || "Failed to load cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [type]);

  // ✅ FIXED FILTERING (IMPORTANT)
  const filteredCars = useMemo(() => {
    const typedCars = cars.filter((car) => {
      if (type === "buy") return car.sale_price != null;
      if (type === "rental") return car.rent_price_per_day != null;
      return true;
    });

    if (activeTab === "new-arrivals") {
      return typedCars.filter((car) => car.status?.isNewArrival);
    }

    if (activeTab === "best-seller") {
      return typedCars.filter((car) => car.status?.isBestSeller);
    }

    if (activeTab === "most-rented") {
      return typedCars.filter((car) => car.status?.isMostRented);
    }

    if (activeTab === "not-available") {
      return typedCars.filter((car) => !car.status?.isAvailable);
    }

    return typedCars;
  }, [cars, type, activeTab]);

  const clearCar = async (id) => {
    try {
      await deleteAdminCar(id);
      setCars((prev) => prev.filter((car) => car.id !== id));
      setActiveCardId(null);
    } catch (err) {
      console.error("Failed to delete car:", err);
      setError(err.response?.data?.error || "Failed to delete car");
    }
  };

  const markNewArrival = async (id) => {
    try {
      await updateAdminCar(id, { is_new_arrival: true });

      setCars((prev) =>
        prev.map((car) =>
          car.id === id
            ? {
                ...car,
                status: {
                  ...car.status,
                  isNewArrival: true,
                },
              }
            : car
        )
      );

      setActiveCardId(null);
    } catch (err) {
      console.error("Failed to update car:", err);
      setError(err.response?.data?.error || "Failed to update car");
    }
  };

  const markBestSeller = async (id) => {
    try {
      await updateAdminCar(id, { is_best_seller: true });

      setCars((prev) =>
        prev.map((car) =>
          car.id === id
            ? {
                ...car,
                status: {
                  ...car.status,
                  isBestSeller: true,
                },
              }
            : car
        )
      );

      setActiveCardId(null);
    } catch (err) {
      console.error("Failed to update car:", err);
      setError(err.response?.data?.error || "Failed to update car");
    }
  };

  const markMostRented = async (id) => {
    try {
      await updateAdminCar(id, { is_most_rented: true });

      setCars((prev) =>
        prev.map((car) =>
          car.id === id
            ? {
                ...car,
                status: {
                  ...car.status,
                  isMostRented: true,
                },
              }
            : car
        )
      );

      setActiveCardId(null);
    } catch (err) {
      console.error("Failed to update car:", err);
      setError(err.response?.data?.error || "Failed to update car");
    }
  };

  const markNotAvailable = async (id) => {
    try {
      await updateAdminCar(id, { status: "maintenance" });

      setCars((prev) =>
        prev.map((car) =>
          car.id === id
            ? {
                ...car,
                status: {
                  ...car.status,
                  isAvailable: false,
                },
              }
            : car
        )
      );

      setActiveCardId(null);
    } catch (err) {
      console.error("Failed to update car:", err);
      setError(err.response?.data?.error || "Failed to update car");
    }
  };

  return {
    cars,
    filteredCars,
    activeTab,
    setActiveTab,
    activeCardId,
    setActiveCardId,
    clearCar,
    markNewArrival,
    markBestSeller,
    markMostRented,
    markNotAvailable,
    loading,
    error,
  };
}

export default useAdminCars;