import { useMemo, useState } from "react";
import mockAdminCars from "../data/mockAdminCars";

function useAdminCars(type) {
  const [cars, setCars] = useState(mockAdminCars);
  const [activeTab, setActiveTab] = useState("all");
  const [activeCardId, setActiveCardId] = useState(null);

  const filteredCars = useMemo(() => {
    const typedCars = cars.filter((car) => car.type === type);

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

  const clearCar = (id) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
    setActiveCardId(null);
  };

  const markNewArrival = (id) => {
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
  };

  const markBestSeller = (id) => {
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
  };

  const markMostRented = (id) => {
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
  };

  const markNotAvailable = (id) => {
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
  };
}

export default useAdminCars;