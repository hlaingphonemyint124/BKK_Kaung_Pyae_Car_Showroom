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

        const carList = (() => {
          if (Array.isArray(data))             return data;
          if (Array.isArray(data?.cars))        return data.cars;
          if (Array.isArray(data?.data))        return data.data;
          if (Array.isArray(data?.data?.cars))  return data.data.cars;
          if (Array.isArray(data?.data?.rows))  return data.data.rows;
          if (Array.isArray(data?.rows))        return data.rows;
          return [];
        })();

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

          sale_price: car.sale_price,
          rent_price_per_day: car.rent_price_per_day,

          specs: {
            fuel: car.fuel_type || car.fuel || "Petrol",
            drive: car.drive_type || car.drive || "2WD",
            doors: car.doors || 4,
            seats: car.seats || 4,
            transmission: car.transmission || "Auto",
          },

          // keep backend status as STRING
          status: car.status || "available",

          // UI-only flags
          uiStatus: {
            isAvailable:
              car.status !== "rented" &&
              car.status !== "sold" &&
              car.status !== "maintenance" &&
              car.status !== "reserved",
          },
        }));

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

  const filteredCars = useMemo(() => {
    const typedCars = cars.filter((car) => {
      if (type === "buy") return car.sale_price != null;
      if (type === "rental") return car.rent_price_per_day != null;
      return true;
    });

    if (activeTab === "available")     return typedCars.filter((c) => c.status === "available");
    if (activeTab === "reserved")      return typedCars.filter((c) => c.status === "reserved");
    if (activeTab === "sold")          return typedCars.filter((c) => c.status === "sold");
    if (activeTab === "rented")        return typedCars.filter((c) => c.status === "rented");
    if (activeTab === "not-available") return typedCars.filter(
      (c) => c.status === "maintenance" || c.status === "reserved"
    );

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

  const markAsStatus = async (id, newStatus) => {
    try {
      await updateAdminCar(id, { status: newStatus });
      setCars((prev) =>
        prev.map((car) =>
          car.id === id
            ? {
                ...car,
                status: newStatus,
                uiStatus: { ...car.uiStatus, isAvailable: newStatus === "available" },
              }
            : car
        )
      );
      setActiveCardId(null);
    } catch (err) {
      console.error("Failed to update car status:", err);
      setError(err.response?.data?.error || "Failed to update status");
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
    markAsStatus,
    loading,
    error,
  };
}

export default useAdminCars;