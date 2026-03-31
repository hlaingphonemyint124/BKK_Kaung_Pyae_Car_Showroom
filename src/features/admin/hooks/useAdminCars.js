import { useMemo, useState } from "react";
import mockAdminCars from "../data/mockAdminCars";

function useAdminCars(type) {
  const [cars, setCars] = useState(mockAdminCars);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredCars = useMemo(() => {
    const typedCars = cars.filter((car) => car.type === type);

    if (activeTab === "most-rented") {
      return typedCars.filter((car) => car.status?.isMostRented);
    }

    if (activeTab === "not-available") {
      return typedCars.filter((car) => !car.status?.isAvailable);
    }

    return typedCars;
  }, [cars, type, activeTab]);

  const openMenu = (car) => {
    setSelectedCar(car);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setSelectedCar(null);
    setIsMenuOpen(false);
  };

  const clearCar = (id) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
    closeMenu();
  };

  const toggleMostRented = (id) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === id
          ? {
              ...car,
              status: {
                ...car.status,
                isMostRented: !car.status?.isMostRented,
              },
            }
          : car
      )
    );
    closeMenu();
  };

  const toggleAvailable = (id) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === id
          ? {
              ...car,
              status: {
                ...car.status,
                isAvailable: !car.status?.isAvailable,
              },
            }
          : car
      )
    );
    closeMenu();
  };

  return {
    cars,
    filteredCars,
    activeTab,
    setActiveTab,
    selectedCar,
    isMenuOpen,
    openMenu,
    closeMenu,
    clearCar,
    toggleMostRented,
    toggleAvailable,
  };
}

export default useAdminCars;